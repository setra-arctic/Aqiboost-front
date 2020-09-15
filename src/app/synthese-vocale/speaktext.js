// AWS.config.region = 'us-east-2'; // Région
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: 'us-east-2:cb38f348-2f0d-43b8-a7de-ee11fdd5e187',
// })

// $(document).ready(function () {
//   $('#name').val('Name1');
// });

// Function invoked by button click
function speakText() {
  // Create the JSON parameters for getSynthesizeSpeechUrl
  alert('début chargement audio')
  // var polly = new AWS.Polly();
  // var speechParams = {
  //   OutputFormat: "mp3",
  //   SampleRate: "16000",
  //   Text: '<speak>' + document.getElementById('TextToSynth').value + '</speak>',
  //   TextType: "ssml",
  //   VoiceId: "Lea"
  // };

  // polly.synthesizeSpeech(speechParams, function (err, data) {
  //   //debugger;
  //   if (err) {
  //     console.log(err, err.stack); // an error occurred
  //     alert(err, err.stack)
  //   } else {
  //     console.log(data); // successful response
  //     var uInt8Array = new Uint8Array(data.AudioStream);
  //     var arrayBuffer = uInt8Array.buffer;
  //     var blob = new Blob([arrayBuffer]);
  //     //
  //     var audio = document.getElementById('audioSource');
  //     var url = URL.createObjectURL(blob);
  //     document.getElementById('audioSource').src = url;
  //     document.getElementById('audioPlayback').load();
  //     alert('audio chargé')
  //   }
  // });



}

speakText();
