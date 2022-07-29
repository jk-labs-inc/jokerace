import Head from 'next/head'
import { getLayout } from '@layouts/LayoutContests'
import type { NextPage } from 'next'
import { useState } from 'react'
import {
    useQuery,
  } from "@tanstack/react-query"
import getPagination from '@helpers/getPagination'
import { supabase } from '@config/supabase'
import ListContests from '@components/_pages/ListContests'

function useContests(initialData: any) {
    const [page, setPage] = useState(0)
    const [itemsPerPage] = useState(7)
    async function getLiveContests(currentPage: number) {
        const { from, to } = getPagination(currentPage, itemsPerPage)
        try {
            const result  = await supabase
            .from('contests')
            .select("*", { count: "exact" })
            // all rows whose submission start date is <= to the current date.
            .lte('start_at', new Date().toISOString())
            // all rows whose votes end date is >= to the current date.
            .gte('end_at', new Date().toISOString())
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
    const queryOptions = {
      keepPreviousData: true,
      staleTime: 5000,
    }
    //@ts-ignore
    if(initialData?.data) queryOptions.initialData = initialData.data

    const { status, data, error, isFetching } = useQuery(
      ['liveContests', page],
      () => getLiveContests(page),
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
        <title>Live contests - JokeDAO</title>
        <meta name="description" content="Live contests on JokeDAO." />
      </Head>

     <div className="container mx-auto pt-10">
      <h1 className='sr-only'>Live contests</h1>
      <ListContests isFetching={isFetching} itemsPerPage={itemsPerPage} status={status} error={error} page={page} setPage={setPage} result={data} />
     </div>
    </>
  )
}

export async function getStaticProps() {
  const { from, to } = getPagination(0, 7)

  const result  = await supabase
  .from('contests')
  .select("*", { count: "exact" })
  .lte('start_at', new Date().toISOString())
  .gte('end_at', new Date().toISOString())
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
  }
}


//@ts-ignore
Page.getLayout = getLayout

export default Page
