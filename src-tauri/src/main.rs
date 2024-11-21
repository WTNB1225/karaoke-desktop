// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;
fn main() {
    //karaoke_app_lib::get_notes_data();
    //karaoke_app_lib::get_notes_data();
    karaoke_app_lib::run();
}
