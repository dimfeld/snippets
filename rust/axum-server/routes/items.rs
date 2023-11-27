use axum::{
    extract::{Path, State},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use axum_extra::routing::{RouterExt, TypedPath};
use serde::Deserialize;

use super::ServerState;
use crate::{db::Db, error::Error, server::error::HttpError};

// pub fn routes() -> Router<ServerState> {
//     Router::new()
//         .route("/active_items", get(get_active_items))
//         .typed_post(dismiss_item)
//         .typed_post(undismiss_item)
// }
