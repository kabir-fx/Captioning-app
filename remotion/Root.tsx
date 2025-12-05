import { Composition } from 'remotion';
import { CaptionedVideo } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={CaptionedVideo as React.FC<any>}
        durationInFrames={300} // Will be overridden by video duration
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          videoSrc: '',
          captions: [],
          style: 'standard' as const,
        }}
      />
    </>
  );
};
