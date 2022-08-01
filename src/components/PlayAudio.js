export default function PlayAudio(url) {

    const audio = new Audio(url);


    return audio.play()
}

