import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        spotifyGreen: "#1db954"
      },
      spacing: {
        '30p': '30%'
      }
    }
  }
}
