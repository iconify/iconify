<script lang="ts">
  import Counter from './lib/Counter.svelte'
  import Icon from '@iconify/svelte';
</script>

<main>
  <div class="logo">
    <Icon icon="logos:svelte-icon" style="display: block; margin: 0 auto;" />
  </div>

  <h1><Icon icon="gg:hello" title="Hello" /> <Icon icon="logos:typescript" title="TypeScript" /> <Icon icon="emojione:heavy-heart-exclamation" title="!" /></h1>

  <Counter />

  <p>
    Visit <a href="https://svelte.dev">svelte.dev <Icon icon="ci:external-link" inline={true}  mode="style" /></a> to learn how to build <Icon icon="logos:svelte" inline={true} />
    apps.
  </p>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit <Icon icon="ci:external-link" inline={true} mode="style" /></a> for
    the officially supported framework, also powered by Vite!
  </p>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  .logo {
    font-size: 16rem;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  :global(h1 svg) {
    vertical-align: -0.125em;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
