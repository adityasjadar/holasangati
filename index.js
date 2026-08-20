// Plain-JS project — these JSDoc typedefs document the shapes used across
// services/components/pages so editors still get autocomplete & type checks
// (VS Code / any TS-aware IDE reads JSDoc typedefs automatically).

/**
 * @typedef {'farmer'|'worker'|'owner'|'admin'} Role
 *
 * @typedef {Object} Profile
 * @property {string} id
 * @property {Role} role
 * @property {string} full_name
 * @property {string} district
 * @property {string} taluk
 * @property {string} village
 * @property {'kn'|'en'} preferred_language
 * @property {number|null} latitude
 * @property {number|null} longitude
 * @property {'active'|'suspended'} status
 * @property {string} created_at
 *
 * @typedef {Object} WorkerProfile
 * @property {string} user_id
 * @property {string[]} work_types
 * @property {number} workers_available
 * @property {string} availability_text
 * @property {string} description
 * @property {boolean} is_active
 *
 * @typedef {Object} Machinery
 * @property {string} id
 * @property {string} owner_id
 * @property {string} machine_type
 * @property {string} machine_name
 * @property {string} description
 * @property {number} price
 * @property {'hour'|'acre'|'day'} price_unit
 * @property {string} district
 * @property {string} taluk
 * @property {string} village
 * @property {number|null} latitude
 * @property {number|null} longitude
 * @property {string|null} available_from
 * @property {string|null} available_to
 * @property {string|null} image_url
 * @property {'active'|'paused'|'deleted'} status
 *
 * @typedef {Object} Requirement
 * @property {string} id
 * @property {string} farmer_id
 * @property {'workers'|'tractor'|'harvester'|'other_machine'} requirement_type
 * @property {string} village
 * @property {string} taluk
 * @property {string} district
 * @property {string} required_date
 * @property {string} quantity
 * @property {string} description
 * @property {'open'|'fulfilled'|'cancelled'} status
 *
 * @typedef {Object} ContactRequest
 * @property {string} id
 * @property {string} from_user
 * @property {string} to_user
 * @property {'worker'|'machinery'|'requirement'} listing_type
 * @property {string|null} listing_id
 * @property {'pending'|'accepted'|'declined'} status
 */
export {};
