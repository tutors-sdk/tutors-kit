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
  import { infoDrawer, calendarDrawer, tocDrawer, storeTheme, currentUser, currentCourse, onlineDrawer } from "tutors-reader-lib/src/stores/stores";
  import PageTransition from "$lib/PageTransition.svelte";
  import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
  import { getKeys } from "../environment";
  import { fromLocalStorage, isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
  import { authService } from "tutors-reader-lib/src/services/auth-service";
  import { goto } from "$app/navigation";
  import TutorsTerms from "$lib/support/TutorsTerms.svelte";
  import { analyticsService } from "tutors-reader-lib/src/services/analytics-service";
  import OnlineBar from "$lib/navigators/sidebars/OnlineBar.svelte";
  import { startPresenceEngine } from "./presence-engine";

  let mounted = false;
  onMount(async () => {
    mounted = true;
    storeTheme.subscribe(setBodyThemeAttribute);

    initFirebase(getKeys().firebase);
    authService.setCredentials(getKeys().auth0);
    startPresenceEngine();

    if ($page.url.hash) {
      authenticating = true;
      const token = $page.url.hash.substring($page.url.hash.indexOf("#") + 1);
      authService.handleAuthentication(token, goto);
    } else {
      if ($currentCourse) {
        authService.checkAuth($currentCourse);
        if (isAuthenticated()) {
          const user = fromLocalStorage();
          currentUser.set(user);
        }
      }
    }
  });

  const themes: any = { tutors };

  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }

  let authenticating = false;
  let transitionKey = "";

  page.subscribe((path) => {
    transitionKey = path.url.pathname;
    if (transitionKey.includes("book") || transitionKey.includes("pdf") || transitionKey.includes("video")) {
      transitionKey = "none";
    }
    if (mounted && path.params.courseid) {
      analyticsService.learningEvent(path.params, path.data);
    }
  });
</script>

<svelte:head>
  {@html `\<style\>${themes[$storeTheme]}}\</style\>`}
</svelte:head>

<div id="app" class="h-full overflow-hidden">
  {#if authenticating}
    <TutorsTerms bind:authenticating="{authenticating}" />
  {:else if $currentCourse}
    <Drawer open="{infoDrawer}" position="left" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <InfoBar />
    </Drawer>
    <Drawer open="{calendarDrawer}" position="left" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <CalendarBar />
    </Drawer>
    <Drawer open="{tocDrawer}" position="right" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <TocBar />
    </Drawer>
    <Drawer open="{onlineDrawer}" position="right" width="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 2xl:w-1/3" blur="backdrop-blur-none" class="z-50">
      <OnlineBar />
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
  {:else}
    <slot />
  {/if}
</div>
