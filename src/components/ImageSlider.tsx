import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css'; // Import Swiper styles
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[]; // Array of image URLs
  onDelete?: (index: number) => void; // Handler for deleting an image
  showDeleteButton?: boolean; // Flag to show/hide delete button
}

const ImageSlider = ({ images, onDelete, showDeleteButton = false }: ImageSliderProps) => {
  return (
    <div className="w-full h-[250px] md:h-[400px] lg:h-[600px] relative">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {images?.map((src, index) => (
          <SwiperSlide key={index} className="relative">
            {/* Image */}
            <Image
              src={`${src}`}
              alt="OfferBoat Admin Panel"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />

            {/* Conditionally render delete button */}
            {showDeleteButton && (
              <button
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                onClick={() => onDelete?.(index)} // Call the onDelete function if it's provided
              >
              <Image src="/trash.png" alt="OfferBoat Admin Panel" width={24} height={24} />
              </button>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
