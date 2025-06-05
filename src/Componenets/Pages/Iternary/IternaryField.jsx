import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { RxCrossCircled } from "react-icons/rx";
import { Toaster, toast } from "react-hot-toast";
import generatePDF from "react-to-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "/src/assets/Logo.png";
import BannerImage from "/src/assets/71840.jpg";
import Qr from "/src/assets/Qr.png";
import { useNavigate } from "react-router-dom";

const IternaryField = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [hotelsWithImages, setHotelsWithImages] = useState([]);
  const [destinationImages, setDestinationImages] = useState([]);
  const [images, setImages] = useState([]);
  const targetRef = useRef();
  const navigate = useNavigate();
  useEffect (() => {
    const fetchItinerary = async () => {
      try {
        const res = await axios.get(
          `https://billing-backend-seven.vercel.app/Iternary/mano/${id}`
        );
        setItinerary(res.data.data);
      } catch (err) {
        console.error("Error fetching itinerary", err);
        toast.error("Failed to load itinerary.");
      }
    };
    fetchItinerary();
  }, [id]);

  useEffect(() => {
    const fetchHotelImages = async () => {
      if (!itinerary?.hotelSelected?.length) {
        setHotelsWithImages([]);
        return;
      }

      const hotels = await Promise.all(
        itinerary.hotelSelected.map(async (hotel) => {
          const hotelId =
            typeof hotel === "string" ? hotel : hotel._id || hotel.value;
          const hotelName =
            typeof hotel === "string"
              ? hotel
              : hotel.name || hotel.label || hotelId;

          try {
            const res = await axios.get(
              `https://billing-backend-seven.vercel.app/gals/all?hotelId=${hotelId}`
            );
            return { hotelName, images: res.data };
          } catch {
            return { hotelName, images: [] };
          }
        })
      );

      setHotelsWithImages(hotels);
    };

    fetchHotelImages();
  }, [itinerary]);

  useEffect(() => {
    const fetchDestinationImages = async () => {
      if (!itinerary?.destinations?.length) {
        setDestinationImages([]);
        return;
      }

      const desti = await Promise.all(
        itinerary.destinations.map(async (destination) => {
          const destId =
            typeof destination === "string"
              ? destination
              : destination._id || destination.value;
          const destName =
            typeof destination === "string"
              ? destination
              : destination.name || destination.label || destId;

          try {
            const res = await axios.get(
              `https://billing-backend-seven.vercel.app/dest/alls?destId=${destId}`
            );
            return { destName, images: res.data };
          } catch {
            return { destName, images: [] };
          }
        })
      );

      setDestinationImages(desti);
    };

    fetchDestinationImages();
  }, [itinerary]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          "https://billing-backend-seven.vercel.app/common/all"
        );
        setImages(res.data);
      } catch (error) {
        console.error("Failed to fetch images:", error);
        toast.error("Failed to load images.");
      }
    };

    // Fetch images only once
    if (images.length === 0) {
      fetchImages();
    }
  }, [images]);

  // const handlePrint = useReactToPrint({
  //   content: () => targetRef.current,
  //   documentTitle: itinerary?.title || "Itinerary",
  //   removeAfterPrint: true,
  // });

  const handleDownloadPDF = async () => {
    const element = targetRef.current;

    if (!element) {
      toast.error("Unable to generate PDF. Please try again.");
      return;
    }

    try {
      // Convert all images to Base64
      const images = element.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(async (img) => {
          if (!img.src.startsWith("data:")) {
            try {
              console.log("Fetching image:", img.src);
              const response = await fetch(img.src, { mode: "cors" });
              const blob = await response.blob();
              const reader = new FileReader();
              reader.onloadend = () => {
                img.src = reader.result;
                console.log("Image converted to Base64:", img.src);
              };
              reader.readAsDataURL(blob);
              await new Promise((resolve) => (reader.onloadend = resolve));
            } catch (error) {
              console.error("Error converting image to Base64:", img.src, error);
            }
          }
        })
      );

      // Add a small delay to ensure all images are rendered
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate canvas from the element
      const canvas = await html2canvas(element, {
        useCORS: true, // Enable cross-origin handling
        allowTaint: false, // Prevent tainting of the canvas
      });
      const imgData = canvas.toDataURL("image/png");

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("itinerary.pdf");

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (!itinerary) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading itinerary...</p>
    );
  }

  const days = Number(itinerary.days);
  const nights = isNaN(days) ? "N/A" : days + 1;
  return (
    <>
      <div>
        <button
          onClick={() => generatePDF(targetRef, { filename: "page.pdf" })}
        >
          Download PDF
        </button>
      </div>
      <div
        ref={targetRef}
        className="min-h-screen text-gray-800 p-6 md:p-12 flex items-start"
      >
        <Toaster />
        <div className="flex justify-end mb-6"></div>
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 space-y-6">
          <div className="flex justify-center">
            <img src={Logo} alt="Logo" className="w-40 h-28 object-contain" />
          </div>
          <div className="w-full mb-4">
            <img
              className="rounded-lg w-full h-[290px] object-cover shadow"
              src={BannerImage}
              alt="Main"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-md">
              <img
                className="rounded-lg w-full h-[150px] object-cover shadow"
                src={BannerImage}
                alt="Main"
              />
            </div>
            <div className="rounded-md">
              <img
                className="rounded-lg w-full h-[150px] object-cover shadow"
                src={BannerImage}
                alt="Main"
              />
            </div>
            <div className="rounded-md">
              <img
                className="rounded-lg w-full h-[150px] object-cover shadow"
                src={BannerImage}
                alt="Main"
              />
            </div>
          </div>
          {/* Logo */}

          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              Shine Travels
            </h2>
            <ul className="space-y-1 text-sm md:text-base">
              <li>
                <strong>Founder/Managing Director:</strong> Yashpal Saini
              </li>
              <li>
                <strong>Manager:</strong> Sumit Singh (Senior Manager,
                Gorakhpur)
              </li>
              <li>
                <strong>Mobile No:</strong> +91-8173923599 / 9140427414
              </li>
              <li>
                <strong>Address:</strong> Bankati Chak, 87-A, Raiganj Rd, near
                Choti Maszid, Raiganj, Gorakhpur, UP 273001
              </li>
              <li>
                <strong>Website:</strong>{" "}
                <a
                  href="https://www.shinetravels.co.in/index.html"
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  www.shinetravels.co.in
                </a>
              </li>
            </ul>
          </div>
          <div className="bg-white ml-[-13px] p-6 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
              {itinerary.title} Trip Summary
            </h2>
            <div className="text-cyan-600 text-lg font-semibold mb-2">
              ₹Ask for Price
            </div>
            <p className="text-gray-700 mb-4">
              The{" "}
              <span className="text-lg underline">
                {isNaN(itinerary.days)
                  ? "Duration not available"
                  : `${itinerary.days} Days / ${nights} Nights`}
              </span>{" "}
              Exclusive Pashupatinath Darshan Tour Package, a Kathmandu Tour
              Package from Gorakhpur, is ideal for everyone. As Nepal’s capital,
              the city thrives with diverse experiences. From rich history to
              breathtaking natural beauty, Kathmandu embraces it all. Its
              vibrant culture and unique lifestyle stand as the heart of Nepal’s
              tourism.
            </p>
            <p className="text-gray-700">
              Visitors can explore ancient temples, bustling markets, and serene
              landscapes, making every moment memorable. The spiritual aura of
              Pashupatinath Temple, combined with Kathmandu’s rich heritage,
              offers a perfect blend of devotion and adventure. Whether seeking
              peace or excitement, this tour has something for everyone.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Basic Information
          </h2>
          <p className="text-gray-600 mb-4 w-[700px]">
            This tour offers a perfect blend of spirituality, history, and
            scenic beauty, making it an ideal journey for travelers of all
            kinds. From the revered temples of Kathmandu to the birthplace of
            Lord Buddha in Lumbini, every destination holds deep cultural and
            religious significance. With comfortable accommodations, expert
            guidance, and a well-structured itinerary, this trip ensures a
            hassle-free and enriching travel experience.
          </p>

          <div className="border rounded-lg p-3 bg-white max-w-2xl mb-6">
            <table
              className="w-full text-left border-separate"
              style={{ borderSpacing: 0 }}
            >
              <tbody>
                {[
                  ["Date of Journey", itinerary.date],
                  ["Pickup Location", itinerary.pickLoc],
                  ["Drop Location", itinerary.dropLoc],
                  ["Pickup Time", itinerary.pickTime],
                  ["Drop Time", itinerary.dropTime],
                  ["Vehicle Type", itinerary.vehicle],
                  ["Package Name", itinerary.package],
                ].map(([label, value]) => (
                  <tr key={label} className="">
                    <td className="p-2 font-medium text-gray-700 flex items-center gap-2">
                      <CheckCircle className="text-cyan-500 w-4 h-4" />
                      {label}
                    </td>
                    <td className="p-3 text-gray-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1 underline">
              Day-wise Itinerary
            </h3>
            {(itinerary.dynamicFields || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itinerary.dynamicFields.map((day, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col"
                  >
                    <h4 className="font-semibold text-lg text-blue-700 mb-2">
                      {day.dayTitle || `Day ${i + 1}`}
                    </h4>
                    <ul className="list-disc list-inside text-sm md:text-base text-gray-700 space-y-2">
                      {(day.points || []).map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="text-green-500 w-5 h-5 mt-1" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No itinerary details available.
              </p>
            )}
          </div>
          <div className="text-left">
            <p className="text-black">
              Note Rs-{itinerary.advance} Please find Paytm or Google Pay Phone
              PayNumberdetail -{" "}
              <span className="underline text-blue-700 cursor-pointer">
                9140427414
              </span>
              <br></br>Shine Travels Please find UPI code -
              saini.yashpal505-1@okicici
            </p>
          </div>
          <div className="mt-6">
            <h3 className="text-2xl font-bold mb-4 underline">
              Included and Excluded
            </h3>
            <p className="text-gray-700 mb-4">
              This package includes a deluxe stay in double or triple-sharing
              rooms with breakfast, ensuring a comfortable experience. All
              transportation is covered with AC cabs, including pickups,
              drop-offs, tolls, permits, parking, and driver allowances. Guided
              sightseeing to mentioned attractions and a local SIM card are also
              provided for convenience.
            </p>
            <div className="grid md:grid-cols-2 gap-6 border rounded-lg p-6 bg-white shadow">
              <div>
                <h4 className="text-lg font-semibold text-green-700 mb-2">
                  Included
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                  {(itinerary.costInclude || []).length > 0 ? (
                    itinerary.costInclude.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="text-green-500 w-5 h-5 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">N/A</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-red-700 mb-2">
                  Excluded
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                  {(itinerary.costExclude || []).length > 0 ? (
                    itinerary.costExclude.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500 text-xl font-bold leading-none">
                          <RxCrossCircled className="text-red-500 w-5 h-5 mt-1" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">N/A</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-1 underline">Destinations</h3>
          {destinationImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinationImages.map((destination, i) => (
                <div key={i} className="p-3">
                  <div className="grid grid-cols-3 w-[850px] gap-2 ml-[-10px]">
                    {destination.images.slice(0, 3).map((img, idx) => (
                      <img
                        key={img._id || idx}
                        src={img.url}
                        alt={destination.destName}
                        className="h-[200px] w-full object-cover rounded mb-2"
                      />
                    ))}
                    {destination.images.length === 0 && (
                      <span className="text-gray-400 text-sm col-span-3">
                        No Images
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No images available.</p>
          )}
          <h3 className="text-lg font-semibold mb-1 underline">Hotels</h3>
          {hotelsWithImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotelsWithImages.map((hotel, i) => (
                <div key={i} className="p-4">
                  <div className="grid grid-cols-4 w-[800px] gap-2">
                    {hotel.images.slice(0, 8).map((img, idx) => (
                      <img
                        key={img._id || idx}
                        src={img.url}
                        alt={hotel.hotelName}
                        className="h-[100px] w-full object-cover rounded mb-2"
                      />
                    ))}
                    {hotel.images.length === 0 && (
                      <span className="text-gray-400 text-sm col-span-2">
                        No images
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No hotel images available.</p>
          )}
          <div className="items-center flex flex-col mt-8">
            <div className="">
              <img src={Qr} alt="Payment QR" className="object-contain mb-2" />
              <div className="text-center">
                <p className="font-semibold text-gray-700">Scan to Pay</p>
                <p className="text-sm text-gray-500">
                  UPI:{" "}
                  <span className="font-mono">saini.yashpal505-1@okicici</span>
                </p>
                <p className="text-sm text-gray-500">
                  Phone: <span className="font-mono">9140427414</span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="underline text-black text-center text-[30px] font-serif font-semibold">
              Our Guest Summary
            </h3>
            {images.length > 0 ? (
              <div
                className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3 mt-4"
                style={{ width: "100%" }}
              >
                {images.map((img, idx) => (
                  <div key={img._id || idx} className="break-inside-avoid mb-3">
                    <img
                      src={img.url}
                      alt={img.name || `Guest ${idx + 1}`}
                      className="w-full rounded shadow object-cover mb-1"
                      style={{ display: "block" }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No guest images available.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IternaryField;
