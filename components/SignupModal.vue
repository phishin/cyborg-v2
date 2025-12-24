<script setup>
import { inject, ref } from 'vue'
import ImageElement from './ImageElement.vue'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
const { $firebase } = useNuxtApp()
import { useLogoStore } from '~/stores/logoStores';
import { useUserProfileStore } from '~/stores/userProfile';
const logoStore = useLogoStore();
const profileStore = useUserProfileStore();


// these must have been provided upstream (e.g. via a parent plugin or provide/inject)
const signupModalVisible = inject('signupModalVisible')
const toggleSignupModal = inject('toggleSignupModal')
const toggleLoginModal = inject('toggleLoginModal')
const logInUser = inject('logInUser')

// form state
const userFullName = ref('')
const userEmail = ref('')
const userPassword  = ref('')
const subscribe = ref(false)
const loginUpdateStatus = ref('')

const splitDisplayName = (displayName = '') => {
  if (!displayName) {
    return { firstName: '', lastName: '' }
  }

  const parts = displayName.trim().split(/\s+/)
  const [firstName = '', ...rest] = parts

  return {
    firstName,
    lastName: rest.join(' '),
  }
}

const ensureGoogleProfile = async (user) => {
  if (!user?.uid) {
    return
  }

  try {
    await profileStore.loadProfile(user.uid)

    const { firstName, lastName } = splitDisplayName(user.displayName || '')
    const updates = {}

    if (!profileStore.hasExistingProfile) {
      updates.firstName = firstName
      updates.lastName = lastName
      updates.email = user.email || profileStore.profile.email || ''
    } else {
      if (!profileStore.profile.firstName && firstName) {
        updates.firstName = firstName
      }

      if (!profileStore.profile.lastName && lastName) {
        updates.lastName = lastName
      }

      if (!profileStore.profile.email && user.email) {
        updates.email = user.email
      }
    }

    if (Object.keys(updates).length > 0) {
      await profileStore.saveProfile(updates)
    }
  } catch (error) {
    console.error('Failed to sync Google profile', error)
  }
}

// 1️⃣ Email/password sign‑up handler
async function signupWithEmailAndPassword(e) {
  e.preventDefault()
  loginUpdateStatus.value = ''

  try {
    // create the user
    const { user } = await $firebase.createUserWithEmailAndPassword(
        $firebase.auth,
        userEmail.value,
        userPassword.value
    )

    // set their display name
    await $firebase.updateProfile(user, {
      displayName: userFullName.value
    })

    // if they checked subscribe, write to Firestore
    if (subscribe.value) {
      await setDoc(
          doc($firebase.firebaseDatabase, 'subscriptions', user.uid),
          {
            email:        user.email,
            fullName:     userFullName.value,
            subscribedAt: serverTimestamp()
          }
      )
    }

    // now log them in & close the modal
    logInUser({
      name:  userFullName.value,
      email: user.email,
      uid:   user.uid
    })
    toggleSignupModal();
    logoStore.closeSaveLogoModal();

  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      loginUpdateStatus.value = 'Email In Use'
    } else {
      loginUpdateStatus.value = err.message
    }
  }
}

// 2️⃣ “Forgot password?” handler
async function resetPassword() {
  loginUpdateStatus.value = ''
  if (!userEmail.value) {
    loginUpdateStatus.value = 'Please enter your email to reset password.'
    return
  }
  try {
    await $firebase.sendPasswordResetEmail($firebase.auth, userEmail.value)
    loginUpdateStatus.value = 'Password reset sent'
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      loginUpdateStatus.value = 'No account found for that email.'
    } else {
      loginUpdateStatus.value = err.message
    }
  }
}

// 3️⃣ Social sign‑up (Google example)
async function signUpWithGoogle(e) {
  e?.preventDefault()

  try {
    const { user } = await $firebase.signInWithPopup($firebase.auth, $firebase.googleProvider)

    await ensureGoogleProfile(user)

    logInUser({
      name:  user.displayName,
      email: user.email,
      uid:   user.uid
    })
    toggleLoginModal();
    logoStore.closeSaveLogoModal();
  } catch (err) {
    console.error(err)
    alert(err.message)
  }
}


</script>


<template>
  <transition name="bounce">
    <div
        v-if="signupModalVisible"
        class="signup-modal fixed flex flex-col justify-center my-auto py-[10vh] items-center w-screen h-screen inset-0 z-[9999] bg-black/90 font-primary backdrop-blur-sm">
      <div class="modal-container-wrapper w-full h-full md:my-[10vh]">
        <div class="modal-container h-full max-h-[90vh] md:max-h-[80vh] overflow-scroll max-w-mobile md:max-w-[686px] md:w-[686px] mx-auto pb-[50px] pt-[16px] px-[27px] bg-white">
          <div class="modal-top w-full relative">
            <div class="modal-trigger close-modal ml-auto mr-0 cursor-pointer max-w-fit" @click="toggleSignupModal">
              <svg class="ml-auto mr-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.01003 4.01015C4.55676 3.46341 5.44319 3.46341 5.98993 4.01015L12 10.0202L18.01 4.01015C18.5568 3.46341 19.4432 3.46341 19.9899 4.01015C20.5367 4.55688 20.5367 5.44331 19.9899 5.99005L13.9799 12.0001L19.9899 18.0101C20.5367 18.5569 20.5367 19.4433 19.9899 19.99C19.4432 20.5368 18.5568 20.5368 18.01 19.99L12 13.98L5.98993 19.99C5.44319 20.5368 4.55676 20.5368 4.01003 19.99C3.46329 19.4433 3.46329 18.5569 4.01003 18.0101L10.0201 12.0001L4.01003 5.99005C3.46329 5.44331 3.46329 4.55688 4.01003 4.01015Z" fill="#1F2937"/>
              </svg>
            </div>
            <div class="modal-top-text w-full relative block pt-[40px] text-center max-w-[408px] mx-auto">
              <h5 class="block relative w-full text-black text-[32px] font-medium leading-[48px] tracking-[-1px]">
                Create an account
              </h5>
              <p class="block relative text-black text-[18px] leading-[1] pt-[0px] font-medium">Save your favorite designs now and decide when you're ready. No rush, just convenience. </p>
            </div>

            <!-- Brand Logos -->
            <div class="login-brand-logos w-full relative grid gap-[24px] justify-center items-center pt-[22px]">
              <div class="logo-item w-[60px] h-full">
                <button @click="signUpWithGoogle" role="button" aria-label="Sign Up With Google">
                  <image-element addon-classes="object-contain block w-[60px] h-[60px]" image-source="/assets/img/social-icon-google.png" :lazy-load="true" alt="Google Login"></image-element>
                </button>
              </div>

              <div class="logo-item w-[60px] h-full">
                <button @click="signUpWithFacebook" role="button" aria-label="Sign Up With Facebook">
                  <image-element addon-classes="object-contain block w-[60px] h-[60px]" image-source="/assets/img/social-icon-facebook.png" :lazy-load="true" alt-text="Facebook Login"></image-element>
                </button>
              </div>

              <div class="logo-item w-[60px] h-full">
                <a href="#">
                  <image-element addon-classes="object-contain block w-[60px] h-[60px]" image-source="/assets/img/social-icon-twitter.png" :lazy-load="true" alt-text="Twitter Login"></image-element>
                </a>
              </div>
            </div>

          </div>

          <div class="modal-divider w-full relative flex flex-row items-center justify-center py-[30px] max-w-[450px] mx-auto">
            <span class="divider bg-black flex-1 h-[2px]"></span>
            <p class="uppercase block font-black text-[20px] leading-[1] px-[10px]"> Or </p>
            <span class="divider bg-black flex-1 h-[2px]"></span>
          </div>

          <div class="modal-signup-form w-full relative block max-w-[450px] mx-auto">
            <form class="w-full relative" id="signup-form" @submit.prevent="signupWithEmailAndPassword">
              <div class="form-wrapper w-full h-full flex flex-col">

                <div class="main-form-fields w-full relative flex flex-col" v-if="loginUpdateStatus !== 'Password reset sent'">
                  <div class="form-field w-full relative pb-[18px]">
                    <label for="full_name" hidden></label>
                    <input name="full_name" id="userFullName" v-model="userFullName" type="text" class="w-full relative bg-white text-neutral-900 text-[16px] py-[16px] px-[12px] border border-neutral-200 rounded-[8px]" required placeholder="Full Name" autocomplete="name">
                  </div>

                  <!-- Email -->
                  <div class="form-field w-full relative pb-[18px]">
                    <label for="email" hidden></label>
                    <input type="email" name="email" id="userEmail" v-model="userEmail" class="w-full relative bg-white text-neutral-900 text-[16px] py-[16px] px-[12px] border border-neutral-200 rounded-[8px]" required placeholder="Email" autocomplete="email">
                  </div>

                  <!-- Password -->
                  <div class="form-field w-full relative pb-[22px]">
                    <label for="password" hidden></label>
                    <input type="password" name="password" id="userPassword" v-model="userPassword" class="w-full relative bg-white text-neutral-900 text-[16px] py-[16px] px-[12px] border border-neutral-200 rounded-[8px]" required placeholder="Password" autocomplete="current-password">
                  </div>

                  <!-- Subscribe -->
                  <div class="form-field w-full relative flex flex-row items-center justify-start">
                    <input v-model="subscribe" type="checkbox" name="subscribe" class="block w-[24px] h-[24px] border-2 border-neutral-200">
                    <label for="subscribe" id="signup_subscribe" class="pl-[8px] text-[16px] text-black font-medium">Subscribe to the Cyborg deals and newsletter</label>
                  </div>
                </div>

                <!-- error message -->
                <div class="error-msg block w-full relative mt-[22px] text-center text-brand-200 font-semibold text-[16px] leading-[1.1]" v-show="loginUpdateStatus">
                  <p v-if="loginUpdateStatus === 'Email In Use'">
                    This email is already in use with a created account. If you forgot your password you can <button @click.prevent="() => { toggleSignupModal(); toggleLoginModal(); }" class="text-brand-electric-blue" role="button"> Login </button> or <button class="text-brand-electric-blue" role="button" @click.prevent="resetPassword(event)">reset your password</button>.
                  </p>
                  <p v-if="loginUpdateStatus === 'Password reset sent'"> A password reset email has been sent to your email address. Please check your inbox. </p>
                </div>

                <div class="submit-btn w-full relative pt-[36px]">
                  <button type="submit" class="text-white w-full relative uppercase font-black text-[20px] text-center py-[25px] px-[105px] bg-brand-300">
                    Submit
                  </button>
                </div>

                <p class="block relative text-center text-[16px] leading-[24px] pt-[8px]">
                  By signing, you agree to our <a class="font-bold text-brand-electric-blue" href="/terms-and-conditions"> terms and conditions </a>
                </p>

              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  </transition>

</template>

<style scoped lang="scss">
.login-brand-logos {
  grid-template-columns: repeat(3, 60px);
}

#signup-form {

}


.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

</style>