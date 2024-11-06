use midly::Smf;
use std::{fmt::format, fs, ptr::null};
use std::str;
use encoding_rs::*;

fn main() {
    let bytes = fs::read("D:/workspace/rust-study/xf-parser/X55087G2.MID").unwrap();
    //get_header(&bytes, b"XFIH");
    get_header(&bytes, b"XFKM");
}

//index + 3 というのは、ff 07 len textという形式のため +3 している スライスをとるには終了indexは含まれないので、2 + 1している
fn get_header(bytes: &[u8], target: &[u8]) {
    let index = bytes.windows(target.len()).position(|w| w == target).unwrap();
    let xfkm_info_marker = b"\xff\x07";
    let xfkm_bytes = &bytes[index..];
    let xfkm_info_index = xfkm_bytes.windows(xfkm_info_marker.len()).position(|w| w == xfkm_info_marker).unwrap();
    let information_header_data_length = *&xfkm_bytes[xfkm_info_index+2] as usize;
    let information_header_end_index = xfkm_info_index + 3 + information_header_data_length as usize;
    let information_header = &xfkm_bytes[xfkm_info_index..information_header_end_index];
    let parts: Vec<&[u8]> = information_header[3..].split(|&byte| byte == b':').collect();
    println!("parts: {:?}", parts);
    for i in 0..parts.len() {
        for j in 0..parts[i].len() {
            print!("{}", parts[i][j] as char);
        }
        println!();
    }
    let mut count = information_header_end_index;
    let xfkm_lyric_marker = b"\xff\x05";
    while count < xfkm_bytes.len() {
        let subbytes = &xfkm_bytes[count..];
        if subbytes.windows(xfkm_lyric_marker.len()).position(|w| w == xfkm_lyric_marker).is_some() {
            let lyric_start_index = subbytes.windows(xfkm_lyric_marker.len()).position(|w| w == xfkm_lyric_marker).unwrap(); //歌詞データの最初のインデックス
            let lyric_data_length = *&subbytes[lyric_start_index+2] as usize; //歌詞データの長さ
            let lyric_end_index = lyric_start_index + 3 + lyric_data_length as usize; //歌詞データの終わりのインデックス
            let lyric_data = &subbytes[lyric_start_index + 3..lyric_end_index]; //歌詞データ
            let lyric: (std::borrow::Cow<'_, str>, &Encoding, bool) = encoding_rs::SHIFT_JIS.decode(lyric_data);
            println!("start: {}", lyric_start_index);
            println!("data: {}", lyric_data_length);
            println!("end: {}", lyric_end_index);
            println!("lyric: {:?}", lyric);
            println!("count: {}", count);
            count += lyric_end_index;
        } else {
            break;
        }
    }
} 