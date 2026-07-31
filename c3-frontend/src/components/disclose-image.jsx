// Manual
// Add to your CSS
// Add the following to your CSS file.

// @theme {
//   --ease-slow: cubic-bezier(.405, 0, .025, 1);
//   --duration-mid: 3s;
// }
// Copy
// Alternatively, you can replace ease-slow with ease-[cubic-bezier(.405,_0,_.025,_1)] and duration-mid with duration-[3000ms] instead of updating your CSS file.

// Run the following command
// It will create a new file called disclose-image.tsx inside the components/animata/image directory.

// mkdir -p components/animata/image && touch components/animata/image/disclose-image.tsx
// Copy
// Paste the code
// Open the newly created file and paste the following code:

// import { type ImgHTMLAttributes, useState } from "react";
 
// import { cn } from "@/lib/utils";
 
// export default function DiscloseImage({
//   className,
//   doorClassName,
//   vertical = false,
//   ...props
// }: ImgHTMLAttributes<HTMLImageElement> & {
//   /**
//    * Class name for the window on the left and right side of the image.
//    */
//   doorClassName?: string;
 
//   /**
//    * If true, the doors will slide vertically.
//    */
//   vertical?: boolean;
// }) {
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const baseClassName =
//     "ease-slow duration-mid absolute bg-sky-500 transition-transform animate-out fill-mode-forwards";
 
//   return (
//     <div className="relative h-64 w-52 overflow-hidden rounded-md bg-yellow-100">
//       {/* Use `next/image` and remove the line below. */}
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         alt=""
//         onLoad={() => setImageLoaded(true)}
//         {...props}
//         className={cn("h-full w-full object-cover", className)}
//       />
 
//       {imageLoaded && (
//         <>
//           <div
//             className={cn(baseClassName, doorClassName, {
//               "top-0 h-1/2 w-full slide-out-to-top-full": vertical,
//               "bottom-0 left-0 top-0 w-1/2 slide-out-to-left-full": !vertical,
//             })}
//           />
//           <div
//             className={cn(baseClassName, doorClassName, {
//               "bottom-0 h-1/2 w-full slide-out-to-bottom-full": vertical,
//               "bottom-0 right-0 top-0 w-1/2 slide-out-to-right-full": !vertical,
//             })}
//           />
//         </>
//       )}
//     </div>
//   );
// }
