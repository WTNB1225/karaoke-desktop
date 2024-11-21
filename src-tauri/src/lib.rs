use midly_extension::{Smf, MetaMessage, MidiMessage, TrackEventKind};
use std::fs;
use encoding_rs::SHIFT_JIS;
use std::collections::HashMap;
use serde::Serialize;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn print_command() -> String {
    "print_command".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            print_command,
            get_notes_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Serialize)]
pub struct NoteData {
    pub frequency: u32,
    pub start_time: f64,
    pub end_time: f64,
}


#[tauri::command]
fn get_notes_data() -> Vec<NoteData> {
    let bytes = fs::read("D:/workspace/midi/BELOVED.MID").unwrap();
    let smf = Smf::parse(&bytes).unwrap();
    //let mut lyrics_sum: u32 = 0;
    let mut midi_sum: f64 = 0.0;
    let mut one_tick: f64 = 0.0;
    let mut sum_time: f64 = 0.0;
    let TPQ: f64 = 480.0;
    let mut hoge: f64 = 0.0;   

    let mut note_data: Vec<NoteData> = Vec::new();

    for track in smf.tracks {
        for (i, event) in track.iter().enumerate() {
            //println!("{:?}", event);
            match event.kind {
                TrackEventKind::Meta(MetaMessage::Lyric(lyric)) => {
                    //println!("{:?}", event);
                    let (lyric, _, _) = SHIFT_JIS.decode(&lyric);
                    //lyrics_sum += u32::from(event.delta);
                }
                TrackEventKind::Meta(MetaMessage::Tempo(tempo)) => {
                    hoge += f64::from(u32::from(event.delta));
                    //println!("{:?}", u32::from(tempo));
                    one_tick = f64::from(u32::from(tempo)) / TPQ / 1000.0;
                    //println!("one_tick: {}", one_tick);
                }
                TrackEventKind::Midi { message, channel: _ } => {
                    hoge += f64::from(u32::from(event.delta));
                    match message {
                        MidiMessage::NoteOff { .. } => {
                            //println!("{:?}", event);;
                        }
                        MidiMessage::NoteOn { .. } => {
                            if u32::from(event.delta) != 0 {
                                let miliseconds = f64::from(u32::from(event.delta)) * one_tick;
                                let mut j = 1;
                                let mut next_milisecond: f64 = 0.0;
                                midi_sum += miliseconds;
                                sum_time += miliseconds;
                                let mut tmp = sum_time;
                                loop {
                                    if track.len() <= i+j {
                                        break;
                                    }
                                    if track[i+j].delta != 0 {
                                        next_milisecond = f64::from(u32::from(track[i+j].delta)) * one_tick;
                                        tmp += next_milisecond;
                                        break;
                                    } else {
                                        j += 1;
                                    }
                                }
                                //println!("miliseconds: {}", miliseconds);
                                //println!("next_miliseconds: {}", next_milisecond);
                                let diff = tmp - sum_time;
                                //println!("diff: {}", diff);
                                if let MidiMessage::NoteOn { key, .. } = message {
                                    let freq = get_freq_from_midi(f32::from(u8::from(key)));            
                                    //println!("event: {:?}", freq.round() as u32);
                                    note_data.push(NoteData {
                                        frequency: freq.round() as u32,
                                        start_time: sum_time / 1000.0,
                                        end_time: (sum_time + diff) / 1000.0,
                                    });
                                }
                            }
                            //println!("miliseconds: {}", miliseconds);
                        }
                        _ => {hoge += f64::from(u32::from(event.delta));},
                    }
                }
                _ => {}
            }
        }
    }

    //println!("midi_sum {}", midi_sum);
    //println!("hoge {}", hoge);
    note_data
}
fn get_freq_from_midi(midi: f32) -> f32 {
    440.0 * (2.0f32).powf((midi - 69.0) / 12.0)
}