<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { CardDeck, UnitCard } from "tutors-ui";
  import { isAuthenticated } from "tutors-reader-lib/src/utils/auth-utils";
  import { initFirebase } from "tutors-reader-lib/src/utils/firebase-utils";
  import { authService } from "tutors-reader-lib/src/services/auth-service";
  import { getKeys } from "../../../environment";
  export let data: PageData;
  let standardDeck = true;

  onMount(async () => {
    if (data.course.authLevel > 0) {
      if (isAuthenticated()) {
        initFirebase(getKeys().firebase);
        authService.setCredentials(getKeys().auth0);
        authService.loadUser(data.course);
      }
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
