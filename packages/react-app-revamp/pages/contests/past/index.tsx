import Head from 'next/head'
import { getLayout } from '@layouts/LayoutContests'
import type { NextPage } from 'next'
import { useState } from 'react'
import {
    useQuery,
  } from "@tanstack/react-query"
import getPagination from '@helpers/getPagination'
import ListContests from '@components/_pages/ListContests'

function useContests(initialData: any) {
    const [page, setPage] = useState(0)
    const [itemsPerPage] = useState(7)
    async function getPastContests(currentPage: number) {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL !== '' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== '' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const config = await import('@config/supabase')
        const supabase = config.supabase
        const { from, to } = getPagination(currentPage, itemsPerPage)
        try {
            const result  = await supabase
            .from('contests')
            .select("*", { count: "exact" })
            // all rows whose votes end date is < to the current date.
            .lt('end_at', new Date().toISOString())
            .order('end_at', { ascending: false })
            .range(from, to) 
            const { data, count, error } = result
            if(error) {
                throw new Error(error.message)
              }
            return {data, count }

        } catch(e) {
            console.error(e)
        }
      }
    }
    const queryOptions = {
      keepPreviousData: true,
      staleTime: 5000,
      
    }

    //@ts-ignore
    if(initialData?.data) queryOptions.initialData = initialData.data


    const { status, data, error, isFetching } = useQuery(
      ['pastContests', page],
      () => getPastContests(page),
      queryOptions,
    )
  
    return {
        itemsPerPage,
        page, 
        setPage,
        status,
        data,
        error,
        isFetching
    }
  
}
const Page: NextPage = (props) => {
  const initialData = props
  const {
        page, 
        setPage,
        status,
        data,
        error,
        itemsPerPage,
        isFetching
    //@ts-ignore
  } = useContests(initialData?.data)

  return (
    <>
      <Head>
        <title>Past contests - JokeDAO</title>
        <meta name="description" content="Past contests on JokeDAO." />
      </Head>

     <div className="container mx-auto pt-10">
      <h1 className='sr-only'>Past contests</h1>
      {process.env.NEXT_PUBLIC_SUPABASE_URL !== '' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== '' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? <ListContests isFetching={isFetching} itemsPerPage={itemsPerPage} status={status} error={error} page={page} setPage={setPage} result={data} /> : <div 
      className='border-neutral-4 animate-appear p-3 rounded-md border-solid border mb-5 text-sm font-bold'>
      This site's current deployment does not have access to jokedao's reference database of contests, but you can check out our manual {" "}<a className='link px-1ex' href="https://docs.google.com/document/d/14NvQuYIv0CpSV8L5nR3iHwbnZ6yH--oywe2d_qDK3rE/edit" target="_blank" rel="noreferrer">
          JokeDAO contests repository
        </a>{" "}for past contests!
      </div>
      }     </div>
    </>
  )
}

export async function getStaticProps() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL !== '' && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== '' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const config = await import('@config/supabase')
    const supabase = config.supabase
  const { from, to } = getPagination(0, 7)

  const result  = await supabase
  .from('contests')
  .select("*", { count: "exact" })
  // all rows whose votes end date is < to the current date.
  .lt('end_at', new Date().toISOString())
  .order('end_at', { ascending: false })
  .range(from, to) 

  const { data, error } = result

  if(error) {
    return {
      props: {},
      revalidate: 60
    }
  }
  return {
    props: {
      data
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 60 seconds
    revalidate: 60, // In seconds
  }}
  return {
    props: {
      data: []
    }
  }
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
