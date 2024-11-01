<script lang="ts">
  import { type IconifyIcon } from 'iconify-icon'

  const plusIcon: IconifyIcon = {
    body: "<path fill=\"currentColor\" d=\"M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6z\"/>",
    width: 24,
    height: 24
  }


  let count = $state(0);
  const increment = () => {
    count += 1
  }

</script>

<button on:click={increment}>
  <iconify-icon icon={plusIcon} inline></iconify-icon> Clicks: {count}
</button>

<style>
  button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 200px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  button:focus {
    border: 2px solid #ff3e00;
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }
</style>
