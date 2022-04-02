use crate::mappings::pref_variants::{
    PrefVariants
};

impl PrefVariants {
    pub fn default() -> Self {
        Self {
            teachers: vec![]
        }
    }
}