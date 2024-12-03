import request from 'request-promise-native';
import { load } from 'cheerio';
import { IMaker, UploadResult } from '.';
import * as fs from 'fs';
import FormData from 'form-data';
import { adjustForImage } from './image';
async function makeRequest(options: any): Promise<any> {
    try {
        return await request(options);
    } catch (err) {
        throw { success: false };
    }
}

const headers = () => {
    let getDate = String(Date.now()).slice(0, 10)
    return {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.81 Safari/537.36',
        'cookie': `_gid=GA1.2.694836508.${getDate}; __gads=ID=e77077076c5a18dc-223769e4b3cf00de:T=${getDate}:RT=${getDate}:S=ALNI_MZ54A8a-CdUL0GH7R1OPfiwplOIyQ; PHPSESSID=1b2hk17njmimvuim3celdji3q3; _ga=GA1.1.170505887.${getDate}; _ga_SK0KDDQM5P=GS1.1.${getDate}.2.1.${getDate}.0`,
    }
}

export async function upload(filePathOrBuffer: string | Buffer): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePathOrBuffer));
    const res = await makeRequest({
        url: 'https://e1.yotools.net/upload',
        method: 'POST',
        headers: {
            ...formData.getHeaders(),
            ...headers()
        },
        body: formData
    });

    const json = JSON.parse(res);
    return {
        buffer: filePathOrBuffer instanceof Buffer ? filePathOrBuffer : fs.readFileSync(filePathOrBuffer),
        ...json
    }
}

export async function ephoto360(
    url: string,
    text: string[],
    uploadResult?: UploadResult
): Promise<IMaker> {
    const headObj = headers();
    try {
        const getResponse = await makeRequest({
            url: url,
            method: "GET",
            followAllRedirects: true,
            headers: headObj
        });

        const $ = load(getResponse);
        const server = $('#build_server').val() as string;
        const serverId = $('#build_server_id').val() as string;
        const token = $('#token').val() as string;

        const types: string[] = [];
        $('.item-input.select_option_wrapper > label').each((i, elem) => {
            types.push($(elem).find('input').val() as string);
        });

        const inputForImage = $('span.btn.btn-primary.choose_file_button')
        const inputForText = $('li:nth-child(1) > div > label')
        let form = {
            'submit': 'GO',
            'token': token,
            'build_server': server,
            'build_server_id': Number(serverId),
            ...(types.length && { 'radio0[radio]': types[Math.floor(Math.random() * types.length)] })
        };
        if (inputForText.length) {
            form['autocomplete0'] = '';
            form['text'] = [...text];
        }
        if (inputForImage.length) {
            if (!uploadResult) {
                throw { success: false, message: 'You need to upload an image' };
            }
            const inputImg = $('#image-file-0')
            const imageDimensions = await adjustForImage(
                uploadResult,
                +inputImg.attr('data-width') as unknown as number,
                +inputImg.attr('data-height') as unknown as number
            )
            form['file_image_input'] = '';
            form['image[]'] = JSON.stringify({
                image: uploadResult.uploaded_file,
                image_thumb: uploadResult.thumb_file,
                icon_file: uploadResult.icon_file,
                x: imageDimensions.x,
                y: imageDimensions.y,
                width: imageDimensions.width,
                height: imageDimensions.height,
                rotate: 0,
                scaleX: 1,
                scaleY: 1,
                thumb_width: imageDimensions.thumb_width
            });
        }

        const postResponse = await makeRequest({
            url: url,
            method: "POST",
            followAllRedirects: true,
            headers: headObj,
            form: form
        });

        const $post = load(postResponse);
        const valueInput = $post('#form_value_input').val() as string;
        if (!valueInput || valueInput === '') {
            throw { success: false, message: 'Failed to get value input' };
        }

        const createImageResponse = await makeRequest({
            url: 'https://en.ephoto360.com/effect/create-image',
            method: 'POST',
            headers: headObj,
            form: JSON.parse(valueInput)
        });

        const parse = JSON.parse(createImageResponse);
        return {
            success: true,
            imageUrl: server + parse.image,
            session_id: parse.session_id
        };
    } catch (err) {
        return err;
    }
}
