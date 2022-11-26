<script lang="ts">
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

  import { infoDrawer, calendarDrawer, onlineDrawer, tocDrawer, storeTheme } from "tutors-reader-lib/src/stores/stores";

  onMount(async () => {
    storeTheme.subscribe(setBodyThemeAttribute);
  });

  const themes: any = { tutors };

  function setBodyThemeAttribute(): void {
    document.body.setAttribute("data-theme", $storeTheme);
  }
</script>

<svelte:head>
  {@html `\<style\>${themes[$storeTheme]}}\</style\>`}
</svelte:head>

<div id="app" class="h-full overflow-hidden">
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
      <slot />
    </div>
    <svelte:fragment slot="pageFooter">
      <div class="bg-surface-100-800-token bottom-0 mt-2">
        <Footer />
      </div>
    </svelte:fragment>
  </AppShell>
</div>
