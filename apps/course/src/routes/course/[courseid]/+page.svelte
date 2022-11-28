<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { CardDeck, UnitCard } from "tutors-ui";
  import { currentUser } from "tutors-reader-lib/src/stores/stores";
  import { fromLocalStorage } from "tutors-reader-lib/src/utils/auth-utils";

  export let data: PageData;
  let standardDeck = true;

  onMount(async () => {
    if (data.course.authLevel > 0) {
      currentUser.set(fromLocalStorage());
    }
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
