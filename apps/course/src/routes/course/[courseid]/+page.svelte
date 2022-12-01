<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import type { PageData } from "./$types";
  import { CardDeck, UnitCard } from "tutors-ui";
  import { authService } from "tutors-reader-lib/src/services/auth-service";
  export let data: PageData;
  let standardDeck = true;

  onMount(async () => {
    authService.checkAuth(data.course);
  });
</script>

{#each data.course.units as unit}
  <UnitCard unit="{unit}" />
{/each}
{#if standardDeck}
  <CardDeck los="{data.course.standardLos}" />
{:else}
  <CardDeck los="{data.course.allLos}" />
{/if}
