// /stores/userProfile.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useNuxtApp } from '#app'
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore'

const createEmptyProfile = () => ({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
})

export const useUserProfileStore = defineStore('userProfile', {
    state: () => ({
        profile: createEmptyProfile(),
        isLoading: false,
        isSaving: false,
        error: null,
        lastSavedAt: null,
        hasExistingProfile: false,
    }),

    actions: {
        resetProfile() {
            this.profile = createEmptyProfile()
            this.error = null
            this.lastSavedAt = null
            this.hasExistingProfile = false
        },

        async loadProfile(userId = null) {
            const nuxtApp = useNuxtApp()
            const { auth, firebaseDatabase } = nuxtApp.$firebase || {}
            const activeUser = userId ? { uid: userId } : auth?.currentUser

            if (!activeUser?.uid || !firebaseDatabase) {
                this.resetProfile()
                return
            }

            this.isLoading = true
            this.error = null

            try {
                const profileRef = doc(firebaseDatabase, 'userProfiles', activeUser.uid)
                const snapshot = await getDoc(profileRef)

                if (snapshot.exists()) {
                    const data = snapshot.data() || {}
                    const normalized = {
                        ...createEmptyProfile(),
                        ...data,
                    }

                    this.profile = normalized
                    this.hasExistingProfile = true

                    const updatedAt = data.updatedAt?.toDate?.()
                    const createdAt = data.createdAt?.toDate?.()
                    this.lastSavedAt = updatedAt || createdAt || null
                } else {
                    const fallbackEmail = auth?.currentUser?.email || ''
                    this.profile = {
                        ...createEmptyProfile(),
                        email: fallbackEmail,
                    }
                    this.hasExistingProfile = false
                    this.lastSavedAt = null
                }
            } catch (error) {
                console.error('Failed to load profile', error)
                this.error = error?.message || 'Unable to load your profile right now.'
                throw error
            } finally {
                this.isLoading = false
            }
        },

        async saveProfile(updates = {}) {
            const nuxtApp = useNuxtApp()
            const firebase = nuxtApp.$firebase || {}
            const { auth, firebaseDatabase, updateProfile, updateEmail } = firebase
            const user = auth?.currentUser

            if (!user?.uid || !firebaseDatabase) {
                const error = new Error('You must be logged in to save your profile.')
                this.error = error.message
                throw error
            }

            this.isSaving = true
            this.error = null

            const mergedProfile = {
                ...createEmptyProfile(),
                ...this.profile,
                ...updates,
                email: updates.email ?? this.profile.email ?? user.email ?? '',
            }

            const payload = {
                ...mergedProfile,
                updatedAt: serverTimestamp(),
            }

            if (!this.hasExistingProfile) {
                payload.createdAt = serverTimestamp()
            }

            try {
                const profileRef = doc(firebaseDatabase, 'userProfiles', user.uid)
                await setDoc(profileRef, payload, { merge: true })

                const displayName = [mergedProfile.firstName, mergedProfile.lastName]
                    .filter(Boolean)
                    .join(' ')
                    .trim()

                if (displayName) {
                    try {
                        await updateProfile?.(user, { displayName })
                    } catch (profileError) {
                        console.warn('Unable to update display name', profileError)
                    }
                }

                if (
                    mergedProfile.email &&
                    user.email &&
                    mergedProfile.email !== user.email &&
                    typeof updateEmail === 'function'
                ) {
                    try {
                        await updateEmail(user, mergedProfile.email)
                    } catch (emailError) {
                        console.warn('Unable to update authentication email', emailError)
                        this.error = this.error || emailError?.message || 'Unable to update email address.'
                    }
                }

                this.profile = mergedProfile
                this.hasExistingProfile = true
                this.lastSavedAt = new Date()
            } catch (error) {
                console.error('Failed to save profile', error)
                this.error = error?.message || 'Unable to save your profile right now.'
                throw error
            } finally {
                this.isSaving = false
            }
        },
    },
})
