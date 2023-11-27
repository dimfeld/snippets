// Dependencies:
//
// error-stack = { version = "0.4.1", features = ["eyre"] }
// log = "0.4.20"
// opentelemetry = { version= "0.21.0" }
// opentelemetry-otlp = "0.14.0"
// opentelemetry-jaeger = { version = "0.20.0", features = [ "rt-tokio-current-thread" ]}
// opentelemetry_sdk = { version= "0.21.1", features = [ "rt-tokio-current-thread" ] }
// thiserror = "1.0.50"
// tracing = "0.1.40"
// tracing-error = "0.2.0"
// tracing-honeycomb = "0.4.3"
// tracing-log = "0.2.0"
// tracing-opentelemetry = "0.22.0"
// tracing-subscriber = { version = "0.3.18", features = ["env-filter"] }
// tracing-tree = "0.3.0"
// tonic = "0.9.2"

use opentelemetry_otlp::WithExportConfig;
use tracing::subscriber::set_global_default;
use tracing_error::ErrorLayer;
use tracing_log::LogTracer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter, Registry};
use tracing_tree::HierarchicalLayer;

pub struct HoneycombConfig {
    pub team: String,
    pub dataset: String,
}

pub enum TracingExportConfig {
    None,
    Honeycomb(HoneycombConfig),
    Jaeger(String),
}

pub fn configure(export_config: TracingExportConfig) -> Result<(), eyre::Report> {
    LogTracer::builder()
        .ignore_crate("rustls")
        .with_max_level(log::LevelFilter::Debug)
        .init()
        .expect("Failed to create logger");

    let env_filter = EnvFilter::try_from_env("LOG").unwrap_or_else(|_| EnvFilter::new("info"));

    let tree = HierarchicalLayer::new(2)
        .with_targets(true)
        .with_bracketed_fields(true);
    let subscriber = Registry::default()
        .with(env_filter)
        .with(tree)
        .with(ErrorLayer::default());

    match export_config {
        TracingExportConfig::Honeycomb(honeycomb_config) => {
            let mut oltp_meta = tonic::metadata::MetadataMap::new();
            oltp_meta.insert("x-honeycomb-team", honeycomb_config.team.parse()?);

            let exporter = opentelemetry_otlp::new_exporter()
                .tonic()
                .with_endpoint("api.honeycomb.io:443")
                .with_metadata(oltp_meta);

            let oltp = opentelemetry_otlp::new_pipeline()
                .tracing()
                .with_trace_config(opentelemetry::sdk::trace::config().with_resource(
                    opentelemetry::sdk::Resource::new(vec![opentelemetry::KeyValue::new(
                        "service.name",
                        honeycomb_config.dataset,
                    )]),
                ))
                .with_exporter(exporter)
                .install_batch(opentelemetry::runtime::TokioCurrentThread)?;
            let telemetry = tracing_opentelemetry::layer().with_tracer(oltp);

            let subscriber = subscriber.with(telemetry);
            set_global_default(subscriber).expect("Setting subscriber");
        }
        TracingExportConfig::Jaeger(endpoint) => {
            let tracer = opentelemetry_jaeger::new_pipeline()
                .with_service_name("pic-store-api")
                .with_agent_endpoint(endpoint.as_str())
                .install_batch(opentelemetry::runtime::TokioCurrentThread)
                .unwrap();
            let telemetry = tracing_opentelemetry::layer().with_tracer(tracer);

            let subscriber = subscriber.with(telemetry);
            set_global_default(subscriber).expect("Setting subscriber");
        }
        TracingExportConfig::None => {
            set_global_default(subscriber).expect("Setting subscriber");
        }
    };

    Ok(())
}

pub fn teardown() {
    opentelemetry::global::shutdown_tracer_provider();
}
