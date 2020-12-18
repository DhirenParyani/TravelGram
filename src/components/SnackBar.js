export const successSnackbar = (message) =>{

    Snackbar.show({
        text:message,
        textColor: 'white',
        backgroundColor: 'red'
      })
}



export const failureSnackbar = (message) =>{
    Snackbar.show({
        text: message,
        textColor: "white",
        backgroundColor: "#1b262c"
    })
}