import * as fortAwesome from "@fortawesome/free-brands-svg-icons";

export function camilaze(str) {
  return str.replace(/-./g, match => match[1].toUpperCase());
}


export function get_fa_brand(_id) {
  const id = camilaze(String(_id));
  let resource = fortAwesome[id];
  if(!resource) {
    throw new Error(`Error while generating page: Cannot find required icon <${_id}> in social_links`);
  }
  return `<svg viewBox="0 0 ${resource.icon[0]} ${resource.icon[1]}"><path d="${resource.icon[4]}" fill="currentColor"></path></svg>`;
}