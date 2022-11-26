<script lang="ts">
  import type { PageData } from "./$types";
  import { CardDeck, UnitCard, TalkCard, VideoCard } from "tutors-ui";
  import type { Topic } from "tutors-reader-lib/src/models/topic";
  export let data: PageData;
</script>

{#if data.topic}
  <div>
    {#each data.topic.panelVideos as lo}
      <VideoCard lo="{lo}" />
    {/each}
    {#each data.topic.panelTalks as lo}
      <TalkCard lo="{lo}" />
    {/each}
    {#each data.topic.units as unit}
      <UnitCard unit="{unit}" />
    {/each}
    <CardDeck los="{data.topic.standardLos}" />
  </div>
{/if}
