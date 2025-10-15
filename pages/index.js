import AuthForm from '../components/AuthForm'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>ZannLog - Next.js + PostgreSQL</title>
        <meta name="description" content="Premium authentication app with beautiful animations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AuthForm />
    </>
  )
}