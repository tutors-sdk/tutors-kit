<script lang="ts">
  import TutorsTerms from "$lib/support/TutorsTerms.svelte";
  import Blank from "$lib/support/Blank.svelte";
  import { authenticating } from "tutors-reader-lib/src/stores/stores";
</script>

{#if $authenticating}
  <Blank />
{/if}
