// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  server: {
    host: true, // Allow access from other devices on the network
    port: 3000, // Default port for Astro
  },
  integrations: [tailwind({
    nesting: true,
  })],
});
