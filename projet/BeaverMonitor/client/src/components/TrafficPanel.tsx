import { useAllRegionsTraffic, TrafficData } from "@/hooks/useTraffic";
import { Car, AlertCircle, Construction, AlertTriangle, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useRef } from "react";

export default function TrafficPanel() {
  const { 
    "GTA Toronto": gtaTorontoTraffic, 
    "Toronto": torontoTraffic, 
    "Hamilton": hamiltonTraffic, 
    "Niagara Region": niagaraRegionTraffic, 
    isLoading, 
    isError 
  } = useAllRegionsTraffic();
  
  const regions = ["GTA Toronto", "Toronto", "Hamilton", "Niagara Region"];
  const [currentRegionIndex, setCurrentRegionIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  
  // Auto-scroll reference
  const autoScrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Region rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeState('out');
      
      // After fade out, change region and fade in
      setTimeout(() => {
        setCurrentRegionIndex((prevIndex) => (prevIndex + 1) % regions.length);
        setFadeState('in');
      }, 500); // 500ms for fade out
    }, 8000); // Change every 8 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScrollContainerRef.current) return;
    
    // Reset to top when region changes
    autoScrollContainerRef.current.scrollTop = 0;
    
    // Only set up auto-scroll if there's content that needs scrolling
    const container = autoScrollContainerRef.current;
    if (container.scrollHeight > container.clientHeight) {
      let scrollInterval: NodeJS.Timeout;
      
      // Start auto-scrolling after a short delay
      const startDelay = setTimeout(() => {
        // Total scroll time should be less than the region display time (8000ms)
        const totalScrollTime = 7000; // 7 seconds (leaving 1s buffer)
        const totalScrollDistance = container.scrollHeight - container.clientHeight;
        const scrollStep = totalScrollDistance / (totalScrollTime / 50); // Move every 50ms
        
        let currentScroll = 0;
        scrollInterval = setInterval(() => {
          if (container && currentScroll < totalScrollDistance) {
            currentScroll += scrollStep;
            container.scrollTop = currentScroll;
          } else {
            // We've reached the bottom, clear the interval
            clearInterval(scrollInterval);
          }
        }, 50);
      }, 1000); // Start scrolling after 1 second of showing the top
      
      return () => {
        clearTimeout(startDelay);
        clearInterval(scrollInterval);
      };
    }
  }, [currentRegionIndex, fadeState]);

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'accident':
        return <AlertCircle className="text-primary mr-2" />;
      case 'construction':
        return <Construction className="text-primary mr-2" />;
      case 'congestion':
        return <AlertTriangle className="text-primary mr-2" />;
      case 'info':
        return <Info className="text-primary mr-2" />;
      default:
        return <AlertTriangle className="text-primary mr-2" />;
    }
  };

  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case 'danger':
        return 'border-[#ff4444]';
      case 'warning':
        return 'border-[#ffbb33]';
      case 'success':
        return 'border-[#00C851]';
      default:
        return 'border-[#ffbb33]';
    }
  };
  
  const renderTrafficCard = (data: TrafficData | undefined, region: string) => {
    if (isLoading) {
      return (
        <div className="w-full h-full">
          <h3 className="text-2xl font-medium mb-4">{region}</h3>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      );
    }

    if (isError || !data) {
      return (
        <div className="w-full h-full">
          <h3 className="text-xl font-medium mb-2">{region}</h3>
          <div className="text-red-500">Impossible de charger les données de circulation.</div>
        </div>
      );
    }

    return (
      <div className="w-full h-full">
        <h3 className="text-xl font-medium mb-2">{region}</h3>
        
        <div 
          ref={autoScrollContainerRef}
          className="space-y-3 h-[220px] overflow-y-auto pr-2 traffic-incidents"
        >
          {data.incidents && data.incidents.length > 0 ? (
            data.incidents.map((incident, index) => (
              <div key={index} className={`border-l-4 ${getSeverityBorderColor(incident.severity)} pl-3 py-2 bg-[#252525] transition-all duration-200 hover:bg-[#2a2a2a] rounded-r`}>
                <div className="flex items-center flex-wrap">
                  {getIncidentIcon(incident.type)}
                  <span className="font-medium break-words">{incident.location}</span>
                </div>
                <p className="text-sm mt-1 break-words pl-7 text-gray-300">{incident.description}</p>
              </div>
            ))
          ) : (
            <div className="text-gray-400">Aucun incident signalé pour cette région.</div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to get the current region data
  const getCurrentRegionData = () => {
    const currentRegion = regions[currentRegionIndex];
    switch (currentRegion) {
      case "GTA Toronto":
        return { data: gtaTorontoTraffic, displayName: "GTA Toronto" };
      case "Toronto":
        return { data: torontoTraffic, displayName: "Toronto" };
      case "Hamilton":
        return { data: hamiltonTraffic, displayName: "Hamilton" };
      case "Niagara Region":
        return { data: niagaraRegionTraffic, displayName: "Région de Niagara" };
      default:
        return { data: gtaTorontoTraffic, displayName: "GTA Toronto" };
    }
  };

  const { data, displayName } = getCurrentRegionData();
  
  useEffect(() => {
    // Prevent page scroll during transitions
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="bg-[#1e1e1e] p-4 flex flex-col border border-[#333333] rounded-lg h-full relative">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl text-white font-bold flex items-center">
          <Car className="text-primary mr-2" />
          Circulation
        </h2>
        
        <div className="flex space-x-2">
          {regions.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                idx === currentRegionIndex ? 'bg-primary scale-125' : 'bg-gray-600'
              }`} 
            />
          ))}
        </div>
      </div>
      
      <div className={`transition-opacity duration-500 flex-1 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}>
        {renderTrafficCard(data as TrafficData, displayName)}
      </div>
    </div>
  );
}