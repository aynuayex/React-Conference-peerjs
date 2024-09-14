import React, { useEffect, useRef } from 'react'

const VideoPlayer: React.FC<{stream?: MediaStream}> = ({stream}) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
      // console.log({stream});
        videoRef.current && stream &&  (videoRef.current.srcObject = stream)
    }, [stream])
    
  return (
    <video ref={videoRef} autoPlay muted />
  )
}

export default VideoPlayer