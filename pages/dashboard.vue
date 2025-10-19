<template>
    <section class="dashboard-page w-full min-h-screen bg-neutral-50 font-primary py-[80px]">
        <div class="max-w-[1200px] mx-auto px-6 lg:px-8">
            <header class="mb-10">
                <h1 class="text-[34px] md:text-[42px] font-black text-black leading-[1.1] mb-4 uppercase">
                    Account Dashboard
                </h1>
                <p class="text-neutral-600 text-[18px] md:text-[20px] leading-[1.5] max-w-3xl">
                    Review and update your Cyborg Logo account details or see saved logos.
                </p>
            </header>

            <div v-if="isAuthChecking" class="bg-white border border-neutral-200 rounded-[16px] shadow-sm p-8 text-center">
                <p class="text-neutral-600 text-[18px] font-medium">Checking your account details...</p>
            </div>

            <div v-else-if="!currentUser" class="bg-white border border-neutral-200 rounded-[16px] shadow-sm p-8">
                <h2 class="text-[24px] font-bold text-black mb-3">You're almost there</h2>
                <p class="text-neutral-600 text-[18px] leading-[1.5]">
                    Sign in to access your dashboard, update your information, and keep all of your saved logo progress in one place.
                </p>
            </div>

            <div v-else class="space-y-12">
                <section class="bg-white border border-neutral-200 rounded-[20px] shadow-sm overflow-hidden">
                    <div class="px-6 md:px-10 py-6 border-b border-neutral-200 bg-neutral-100">
                        <h2 class="text-[26px] md:text-[30px] font-black text-black uppercase">Profile Details</h2>
                        <p class="text-neutral-600 text-[16px] md:text-[18px] leading-[1.5]">
                            Update the information we use when contacting you about your designs or delivering finished files.
                        </p>
                    </div>
                    <form class="px-6 md:px-10 py-8 space-y-8" @submit.prevent="handleSave">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="flex flex-col">
                                <label for="firstName" class="text-[15px] font-semibold text-neutral-700 mb-2 uppercase tracking-[1px]">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    v-model="form.firstName"
                                    type="text"
                                    autocomplete="given-name"
                                    class="rounded-[10px] border border-neutral-300 focus:border-brand-300 focus:ring-0 text-[16px] text-neutral-900 px-4 py-3 disabled:bg-neutral-100 disabled:text-neutral-400"
                                    placeholder="John"
                                    :disabled="isLoadingProfile || isAuthChecking || isSaving"
                                />
                            </div>
                            <div class="flex flex-col">
                                <label for="lastName" class="text-[15px] font-semibold text-neutral-700 mb-2 uppercase tracking-[1px]">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    v-model="form.lastName"
                                    type="text"
                                    autocomplete="family-name"
                                    class="rounded-[10px] border border-neutral-300 focus:border-brand-300 focus:ring-0 text-[16px] text-neutral-900 px-4 py-3 disabled:bg-neutral-100 disabled:text-neutral-400"
                                    placeholder="Doe"
                                    :disabled="isLoadingProfile || isAuthChecking || isSaving"
                                />
                            </div>
                            <div class="flex flex-col">
                                <label for="phone" class="text-[15px] font-semibold text-neutral-700 mb-2 uppercase tracking-[1px]">
                                    Phone
                                </label>
                                <input
                                    id="phone"
                                    v-model="form.phone"
                                    type="tel"
                                    autocomplete="tel"
                                    class="rounded-[10px] border border-neutral-300 focus:border-brand-300 focus:ring-0 text-[16px] text-neutral-900 px-4 py-3 disabled:bg-neutral-100 disabled:text-neutral-400"
                                    placeholder="(555) 123-4567"
                                    :disabled="isLoadingProfile || isAuthChecking || isSaving"
                                />
                            </div>
                            <div class="flex flex-col">
                                <label for="email" class="text-[15px] font-semibold text-neutral-700 mb-2 uppercase tracking-[1px]">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    v-model="form.email"
                                    type="email"
                                    autocomplete="email"
                                    class="rounded-[10px] border border-neutral-300 focus:border-brand-300 focus:ring-0 text-[16px] text-neutral-900 px-4 py-3 disabled:bg-neutral-100 disabled:text-neutral-400"
                                    placeholder="you@example.com"
                                    :disabled="isLoadingProfile || isAuthChecking || isSaving"
                                />
                            </div>
                        </div>

                        <div class="space-y-3">
                            <p
                                v-if="profileError"
                                class="bg-red-50 border border-red-200 text-red-600 text-[16px] font-medium px-4 py-3 rounded-[10px]"
                            >
                                {{ profileError }}
                            </p>
                            <p
                                v-if="feedback.success"
                                class="bg-green-50 border border-green-200 text-green-700 text-[16px] font-medium px-4 py-3 rounded-[5px]"
                            >
                                {{ feedback.success }}
                            </p>
                        </div>

                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <p v-if="lastSavedCopy" class="text-[14px] text-neutral-500">
                                Last saved {{ lastSavedCopy }}
                            </p>
                            <button
                                type="submit"
                                class="cta-btn bg-brand-300 text-white uppercase font-black tracking-[2px] text-[16px] leading-[1] py-4 px-6 transition transition-fast hover:bg-brand-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="isSaving || isLoadingProfile || isAuthChecking || !hasChanges"
                            >
                                <span v-if="isSaving">Saving...</span>
                                <span v-else>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </section>

                <section class="bg-white border border-neutral-200 rounded-[5px] shadow-sm overflow-hidden">
                    <div class="px-6 md:px-10 py-6 border-b border-neutral-200 bg-neutral-100">
                        <h2 class="text-[26px] md:text-[30px] font-black text-black uppercase">Saved Logos</h2>
                        <p class="text-neutral-600 text-[16px] md:text-[18px] leading-[1.5]">
                            Revisit any concept you saved. Restoring a logo sends you right back into the builder with the same settings.
                        </p>
                    </div>
                    <div class="px-6 md:px-10 py-8 space-y-6">
                        <div v-if="logosLoading" class="text-neutral-600 text-[18px] font-medium">Loading saved logos...</div>
                        <div v-else-if="!formattedLogos.length" class="text-neutral-600 text-[18px] font-medium">
                            You haven't saved any logos yet. Generate designs and save your favorites to see them here.
                        </div>
                        <div v-else class="grid gap-6">
                            <article
                                v-for="logo in formattedLogos"
                                :key="logo.id"
                                class="border border-neutral-200 rounded-[5px] p-6 bg-neutral-50"
                            >
                                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div class="space-y-2">
                                        <h3 class="text-[20px] font-bold text-black leading-[1.2]">
                                            {{ getLogoTitle(logo) }}
                                        </h3>
                                        <p class="text-[14px] text-neutral-500">
                                            Saved {{ formatDisplayDate(logo.createdAtDate) }}
                                        </p>
                                        <p v-if="logo.state?.selectedLogoID" class="text-[14px] text-neutral-500">
                                            Logo ID: {{ logo.state.selectedLogoID }}
                                        </p>
                                        <p v-if="logo.state?.businessCategory" class="text-[14px] text-neutral-500">
                                            Category: {{ logo.state.businessCategory }}
                                        </p>
                                        <p v-if="logo.state?.selectedIndustry" class="text-[14px] text-neutral-500">
                                            Industry: {{ logo.state.selectedIndustry?.name || logo.state.selectedIndustry }}
                                        </p>
                                        <div v-if="logo.state?.selectedColorStyles?.length" class="flex flex-wrap gap-2 pt-1">
                                            <span
                                                v-for="(color, index) in logo.state.selectedColorStyles"
                                                :key="`${logo.id}-color-${index}`"
                                                class="px-3 py-1 rounded-[5px] bg-white border border-brand-field-border-gray text-[13px] text-neutral-600"
                                            >
                                                {{ color?.name || color }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-stretch gap-3 min-w-[180px]">
                                        <button
                                            type="button"
                                            class="cta-btn bg-brand-300 text-white uppercase font-black tracking-[2px] text-[14px] leading-[1] py-3 px-4 rounded-[10px] transition transition-fast hover:bg-brand-200"
                                            @click="resumeLogo(logo)"
                                        >
                                            Resume Editing
                                        </button>
<!--                                        <button-->
<!--                                            type="button"-->
<!--                                            class="text-brand-300 font-bold text-[14px] underline"-->
<!--                                            @click="exportLogoState(logo)"-->
<!--                                        >-->
<!--                                            Download Settings-->
<!--                                        </button>-->
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useNuxtApp, useHead } from '#imports'
import { useLogoStore } from '~/stores/logoStores'
import { useUserProfileStore } from '~/stores/userProfile'

useHead({
    title: 'Account Dashboard | Cyborg Logo'
})

const router = useRouter()
const nuxtApp = useNuxtApp()
const logoStore = useLogoStore()
const profileStore = useUserProfileStore()

const form = reactive({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
})

const feedback = reactive({
    success: '',
})

const auth = nuxtApp.$firebase?.auth || null
const listenAuthState = nuxtApp.$firebase?.onAuthStateChanged

const currentUser = ref(auth?.currentUser || null)
const isAuthChecking = ref(!currentUser.value)
const logosLoading = ref(false)
const unsubscribeAuth = ref(null)

const normalizeDateValue = (value) => {
    if (!value) return null
    if (typeof value.toDate === 'function') {
        try {
            return value.toDate()
        } catch (error) {
            return null
        }
    }
    if (value instanceof Date) return value
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatDisplayDate = (value) => {
    if (!value) return 'just now'
    try {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(value)
    } catch (error) {
        return value.toString()
    }
}

const getLogoTitle = (logo) => (
    logo?.state?.fullBusinessName ||
    logo?.state?.companyName ||
    logo?.state?.businessNameInitials ||
    'Saved Logo'
)

const exportLogoState = (logo) => {
    if (!logo?.state) return
    const blob = new Blob([JSON.stringify(logo.state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const title = getLogoTitle(logo)
        .replace(/[^a-z0-9-_]+/gi, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '')
    link.download = `${title || 'logo-settings'}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

const profileError = computed(() => profileStore.error)
const isLoadingProfile = computed(() => profileStore.isLoading)
const isSaving = computed(() => profileStore.isSaving)
const lastSavedCopy = computed(() => {
    if (!profileStore.lastSavedAt) return ''
    return formatDisplayDate(profileStore.lastSavedAt)
})

const hasChanges = computed(() => {
    const source = profileStore.profile || {}
    return ['firstName', 'lastName', 'phone', 'email'].some((field) => (form[field] || '') !== (source[field] || ''))
})

const savedLogos = computed(() => logoStore.savedLogos || [])

const formattedLogos = computed(() =>
    savedLogos.value.map((logo) => ({
        ...logo,
        createdAtDate: normalizeDateValue(logo.createdAt),
    }))
)

watch(
    () => profileStore.profile,
    (profile) => {
        form.firstName = profile?.firstName || ''
        form.lastName = profile?.lastName || ''
        form.phone = profile?.phone || ''
        form.email = profile?.email || ''
    },
    { immediate: true }
)

const resumeLogo = (logo) => {
    if (!logo) return
    logoStore.restoreLogo(logo)
    router.push('/create-my-logo')
}

const loadDashboardData = async (user) => {
    if (!user) {
        currentUser.value = null
        isAuthChecking.value = false
        feedback.success = ''
        profileStore.resetProfile()
        logoStore.$patch({ savedLogos: [] })
        return
    }

    currentUser.value = user
    isAuthChecking.value = false
    feedback.success = ''

    try {
        await profileStore.loadProfile(user.uid)
    } catch (error) {
        // Errors are captured in the store
    }

    logosLoading.value = true
    try {
        await logoStore.fetchSavedLogos()
    } catch (error) {
        console.error('Unable to load saved logos', error)
    } finally {
        logosLoading.value = false
    }
}

onMounted(async () => {
    if (auth?.currentUser) {
        await loadDashboardData(auth.currentUser)
    } else {
        isAuthChecking.value = true
    }

    if (listenAuthState && auth) {
        unsubscribeAuth.value = listenAuthState(auth, (user) => {
            loadDashboardData(user)
        })
    } else {
        isAuthChecking.value = false
    }
})

onUnmounted(() => {
    if (typeof unsubscribeAuth.value === 'function') {
        unsubscribeAuth.value()
    }
})

const handleSave = async () => {
    feedback.success = ''

    try {
        await profileStore.saveProfile({ ...form })
        if (!profileError.value) {
            feedback.success = 'Profile updated successfully.'
        }
    } catch (error) {
        // Error message is surfaced via profileError
    }
}
</script>

<style scoped>
.dashboard-page {
    background-image: linear-gradient(180deg, rgba(243, 244, 246, 0.85) 0%, rgba(255, 255, 255, 0.95) 100%);
}
</style>
