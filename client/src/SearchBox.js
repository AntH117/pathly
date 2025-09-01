import React from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { PlaceAutocompleteElement } from "@vis.gl/react-google-maps";

export default function SearchBox({ onPlaceSelected, placeholder, initialValue }) {
  const inputRef = React.useRef(null);
  const placesLib = useMapsLibrary("places");
  const [value, setValue] = React.useState('')
  
  React.useEffect(() => {
    setValue(initialValue || ""); // update when initialValue changes
  }, [initialValue]);

  React.useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
    componentRestrictions: { country: "au" }, // Restricts locations to australia
      fields: ["place_id", "geometry", "name", "formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        onPlaceSelected(place);
        setValue(place)
      }
    });
  }, [placesLib, onPlaceSelected]);

  return (
    <input className='pathly-start-input' placeholder={placeholder || 'start'} ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} initialValue={initialValue}>
    </input>
  );
}
