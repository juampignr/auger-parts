export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request,{ params }) {

    try {

        let { temperature } = params
        let status
        console.log(temperature)

        if(temperature){

            status = "ok"

        }else{

            status = "error"
        }


        return Response.json({"status":status})

    } catch (error) {
            
        return Response.json({"status":"error","error":error.stack})
    }
}