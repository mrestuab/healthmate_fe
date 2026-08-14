const devAPIURL = "http://127.0.0.1:5000"
// const devAPIURL = "http://localhost:3000" //ini dev vercel
const prodAPIURL = "https://healthmate-be-jade.vercel.app/"
const isProd = true

export const getBaseUrl = (url) => {
  if (isProd) return `${prodAPIURL}${url}`
  else return `${devAPIURL}${url}`
}

