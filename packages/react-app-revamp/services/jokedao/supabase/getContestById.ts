export async function getContestById(args: {contestId: string; chainName: string}) {
    try {
        const { contestId, chainName } = args
        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ) {
            const config = await import("@config/supabase");
            const supabase = config.supabase;
            const { data } = await supabase.from("contests")
            .select('title, cover_image_src_uri')
            .eq("address", contestId)
            .eq("address", contestId)

            if(data) {
                return {
                    ok: true,
                    data: data?.[0],
                }
            } return {
                ok: false
            }
        } else {
            return {
                ok: false
            }
        }

    } catch(e) {
        console.error(e)
        return {
            ok: false
        }
    }
}

export default getContestById