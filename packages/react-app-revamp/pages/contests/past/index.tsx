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

function useContests() {
    const [page, setPage] = useState(0)
    const [itemsPerPage] = useState(7)
    async function getPastContests(currentPage: number) {
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
  
    const { status, data, error, isFetching } = useQuery(
      ['pastContests', page],
      () => getPastContests(page),
      { keepPreviousData: true, staleTime: 5000 },
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
const Page: NextPage = () => {
  const {
        page, 
        setPage,
        status,
        data,
        error,
        itemsPerPage,
        isFetching
  } = useContests()

  return (
    <>
      <Head>
        <title>Past contests - JokeDAO</title>
        <meta name="description" content="Past contests on JokeDAO." />
      </Head>

     <div className="container mx-auto pt-10">
      <h1 className='sr-only'>Past contests</h1>
      <ListContests isFetching={isFetching} itemsPerPage={itemsPerPage} status={status} error={error} page={page} setPage={setPage} result={data} />
     </div>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
