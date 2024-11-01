<script lang="ts">
  import 'iconify-icon';
  import Counter from './lib/Counter.svelte'
</script>

<main>
  <div class="logo">
    <iconify-icon icon="logos:svelte-icon"></iconify-icon>
  </div>

  <h1>
    Title:
    <iconify-icon icon="gg:hello" title="Hello"></iconify-icon> 
    <iconify-icon icon="logos:typescript" title="TypeScript"></iconify-icon> 
    <iconify-icon icon="emojione:heavy-heart-exclamation" title="!"></iconify-icon>
  </h1>

  <Counter />

  <p>
    Visit <a href="https://svelte.dev">svelte.dev <iconify-icon icon="line-md:external-link" inline mode="style"></iconify-icon></a> to learn how to build <iconify-icon icon="logos:svelte" inline></iconify-icon>
    apps.
  </p>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit <iconify-icon icon="line-md:external-link" inline mode="style"></iconify-icon></a> for
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

  h1 iconify-icon {
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
