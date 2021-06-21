// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import ipPort from "../../common/ipPort";
import { post } from "../../utils/requestUtil"

export async function addFavour(value){
    try {
        let res = await post(ipPort + '/default/addFavour', value);
        if (res.data.success) {
            return { success: true, msg: '点赞成功' }
        } else {
            return { success: false, msg: '点赞失败' }
        }
    } catch (error) {
        return { success: false, msg: error }
    }
}
