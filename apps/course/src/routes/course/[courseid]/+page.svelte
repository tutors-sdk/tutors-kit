<script lang="ts">
  import type { PageData } from "./$types";
  import { CardDeck, UnitCard } from "tutors-ui";

  export let data: PageData;
  let standardDeck = true;
</script>

{#each data.course.units as unit}
  <UnitCard unit="{unit}" />
{/each}
{#if standardDeck}
  <CardDeck los="{data.course.standardLos}" />
{:else}
  <CardDeck los="{data.course.allLos}" />
{/if}
