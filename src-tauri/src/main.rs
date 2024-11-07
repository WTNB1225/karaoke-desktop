// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use karaoke_app_lib::{Smf, TrackEventKind, MetaMessage};
use std::fs;
use encoding_rs::SHIFT_JIS;

fn main() {
    let bytes = fs::read("D:/workspace/midi/BELOVED.MID").unwrap();
    let smf = Smf::parse(&bytes).unwrap();
    let mut lyrics_sum: u32 = 0;
    let mut midi_sum: u32 = 0;
    for track in smf.tracks {
        for event in track {
            match event.kind {
                TrackEventKind::Meta(MetaMessage::Lyric(lyric)) => {
                    let (lyric, _, _) = SHIFT_JIS.decode(&lyric);
                    //println!("{}", lyric);
                    lyrics_sum += u32::from(event.delta);
                }
                TrackEventKind::Midi {..} => {
                    midi_sum += u32::from(event.delta);
                }
                _ => {}
            }
        }
    }
    println!("lyrics_sum: {}", lyrics_sum);
    println!("midi_sum: {}", midi_sum);
    karaoke_app_lib::run();
}