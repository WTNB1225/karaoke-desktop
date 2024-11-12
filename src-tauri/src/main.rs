// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use karaoke_app_lib::{Smf, TrackEventKind, MetaMessage, MidiMessage};
use std::fs;
use encoding_rs::SHIFT_JIS;
use std::collections::HashMap;

fn main() {
    let bytes = fs::read("D:/workspace/midi/BELOVED.MID").unwrap();
    let smf = Smf::parse(&bytes).unwrap();
    let mut lyrics_sum: u32 = 0;
    let mut midi_sum: f64 = 0.0;
    let mut absolute_time: u32 = 0;
    let mut tempo: f64 = 0.0;
    let mut one_tick: f64 = 0.0;
    let TPQ: f64 = 480.0;
    let mut prev_time = 1;
    
    let mut note_on_time: HashMap<&str, f64> = HashMap::new();


    for track in smf.tracks {
        for event in track {
            //println!("{:?}", event);
            match event.kind {
                TrackEventKind::Meta(MetaMessage::Lyric(lyric)) => {
                    //println!("{:?}", event);
                    let (lyric, _, _) = SHIFT_JIS.decode(&lyric);
                    //lyrics_sum += u32::from(event.delta);
                }
                TrackEventKind::Meta(MetaMessage::Tempo(tempo)) => {
                    //println!("{:?}", u32::from(tempo));
                    one_tick = f64::from(u32::from(tempo)) / TPQ / 1000.0;
                    //println!("one_tick: {}", one_tick);
                }
                TrackEventKind::Midi { message, channel: _ } => {
                    match message {
                        MidiMessage::NoteOff { .. } => {
                            //println!("{:?}", event);
                        }
                        MidiMessage::NoteOn { .. } => {
                            if u32::from(event.delta) != 0 {
                                let miliseconds = f64::from(u32::from(event.delta)) * one_tick;
                                midi_sum += miliseconds;
                                if let MidiMessage::NoteOn { key, .. } = message {
                                    let freq = get_freq_from_midi(f32::from(u8::from(key)));
                                    println!("event: {:?}", freq);
                                }
                            }
                            //println!("miliseconds: {}", miliseconds);
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        }
    }
    println!("lyrics_sum: {}", midi_sum);
}

fn get_freq_from_midi(midi: f32) -> f32 {
    440.0 * (2.0f32).powf((midi - 69.0) / 12.0)
}