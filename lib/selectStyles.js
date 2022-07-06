const selectStyles = (dark) => {
  return {
    control: (base, state) => ({
      ...base,
      background: dark ? "#111111" : "white",
      // match with the menu
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      // Overwrittes the different states of border
      borderColor: state.isFocused ? "#06768d" : "#CCCCCC",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? "#06768d" : "#111111"
      }
    }),
    menu: base => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
      color: dark ? 'white' : '#111111',
    }),
    menuList: base => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
      background: "#111111",
    }),
    option: (base, state) => ({
      ...base,
      background: dark ?
        state.isFocused ? '#06768d' : 'black'
        :
        state.isFocused ? '#06768d' : 'white',
      color: state.isFocused && 'white',
    }),
    singleValue: (base) => ({
      ...base,
      color: dark ? 'white' : '#111111',
    })
  }
}

export default selectStyles
