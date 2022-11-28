<script lang="ts">
  import { page } from "$app/stores";
  import "@brainandbones/skeleton/styles/all.css";
  import { AppShell, Drawer } from "@brainandbones/skeleton";
  import { onMount } from "svelte";
  import NavBar from "$lib/navigators/NavBar.svelte";
  import PageHeader from "$lib/navigators/PageHeader.svelte";
  import { Footer } from "tutors-ui";
  import InfoBar from "$lib/navigators/sidebars/InfoBar.svelte";
  import CalendarBar from "$lib/navigators/sidebars/CalendarBar.svelte";
  import TocBar from "$lib/navigators/sidebars/TocBar.svelte";
  import tutors from "tutors-ui/lib/themes/tutors.css";

  import { infoDrawer, calendarDrawer, tocDrawer, storeTheme, currentUser, currentCourse } from "tutors-reader-lib/src/stores/stores";
  import PageTransition from "$lib/PageTransition.svelte";
  import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
  import { getKeys } from "../environment";
  import { getUserId, isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
  import { checkAuth, handleAuthentication } from "tutors-reader-lib/src/services/auth-service";
  import { fetchUserById } from "tutors-reader-lib/src/utils/metrics-utils";
  import { goto } from "$app/navigation";
  import { WebAuth } from "auth0-js";
  import TutorsTerms from "$lib/support/TutorsTerms.svelte";

  const auth0 = new WebAuth({
    domain: getKeys().auth0.domain,
    clientID: getKeys().auth0.clientId,
    redirectUri: getKeys().auth0.redirectUri,
    audience: `https://${getKeys().auth0.domain}/userinfo`,
    responseType: "token id_token",
    scope: "openid"
  });

  onMount(async () => {
    storeTheme.subscribe(setBodyThemeAttribute);

    initFirebase(getKeys().firebase);
    checkAuth($currentCourse, auth0);
    if (isAuthenticated()) {
      const user = await fetchUserById($currentCourse.url, getUserId(), null);
      currentUser.set(user);
    }
  });

  const themes: any = { tutors };

  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }

  let authenticating = false;
  let transitionKey = "";
  page.subscribe((path) => {
    const hash = path.url?.hash;
    if (hash?.includes("access_token")) {
      const token = hash.substring(hash.indexOf("#") + 1);
      handleAuthentication(token, auth0, goto);
      authenticating = true;
    }
    transitionKey = path.url.pathname;
    if (transitionKey.includes("book")) {
      transitionKey = "book";
    }
  });
</script>

<svelte:head>
  {@html `\<style\>${themes[$storeTheme]}}\</style\>`}
</svelte:head>

<div id="app" class="h-full overflow-hidden">
  {#if authenticating}
    <TutorsTerms bind:authenticating="{authenticating}" />
  {:else}
    <Drawer open="{infoDrawer}" position="left" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <InfoBar />
    </Drawer>

    <Drawer open="{calendarDrawer}" position="left" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <CalendarBar />
    </Drawer>

    <Drawer open="{tocDrawer}" position="right" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <TocBar />
    </Drawer>
    <AppShell class="h-screen">
      <svelte:fragment slot="header">
        <NavBar />
        <PageHeader />
      </svelte:fragment>
      <div id="top"></div>
      <div class="mx-auto my-4">
        <PageTransition url="{transitionKey}">
          <slot />
        </PageTransition>
      </div>
      <svelte:fragment slot="pageFooter">
        <div class="bg-surface-100-800-token bottom-0 mt-2">
          <Footer />
        </div>
      </svelte:fragment>
    </AppShell>
  {/if}
</div>
