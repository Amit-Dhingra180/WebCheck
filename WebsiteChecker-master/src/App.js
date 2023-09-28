import React, {useState, useEffect} from 'react';

function App() {
  const [urlList, setUrlList] = useState([]);
  const [currentUrl, setCurrentUrl] = useState('');
  
  const handleCheckButtonClick = async () => {
    
    if (currentUrl.trim() === '') {
      alert('Please enter a URL');
      return; 
    }

    if (urlList.some((item) => item.url === currentUrl)) {
      alert('URL already exists');
      return; 
    }

    try {
      const response = await fetch(`http://localhost:3001/proxy?url=${encodeURIComponent(currentUrl)}`, {
        method: 'HEAD',
      });
      const urlStatus = {
        url: currentUrl,
        status: response.status,
      };
      const existingData = JSON.parse(localStorage.getItem('urlData')) || [];

      const newData = [...existingData, urlStatus];
  
      localStorage.setItem('urlData', JSON.stringify(newData));
  
      setUrlList(newData);
      
      setCurrentUrl('');
    } catch (error) {
      console.error('Fetch error:', error);
      
    }
  };

  useEffect(() => {
    
    const fetchAndUpdateUrlStatuses = async () => {
      const existingData = JSON.parse(localStorage.getItem('urlData')) || [];
      const updatedData = [];

      for (const item of existingData) {
        try {
          const response = await fetch(`http://localhost:3001/proxy?url=${encodeURIComponent(item.url)}`, {
            method: 'HEAD',
          });
          const updatedItem = {
            url: item.url,
            status: response.status,
          };
          updatedData.push(updatedItem);
        } catch (error) {
          console.error('Fetch error:', error);
          
          updatedData.push(item); 
        }
      }

      
      localStorage.setItem('urlData', JSON.stringify(updatedData));
      setUrlList(updatedData);
    };

    
    fetchAndUpdateUrlStatuses();
    
    const intervalId = setInterval(fetchAndUpdateUrlStatuses,  15*60*1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
    <h1 className='text-4xl font-semibold text-center my-2'>Website Checker</h1>

    <div className='m-6'>

    <div className='text-center'>
      <input
        type="text"
        placeholder="Enter URL"
        value={currentUrl}
        onChange={(e) => setCurrentUrl(e.target.value)}
        className='w-80 h-9 p-2 bg-gray-200'
      />

      <button onClick={handleCheckButtonClick} className='ml-4 bg-black text-white p-1'>
        Check
      </button>
    </div>

      <div className='mt-8'>
      {urlList.map((urlStatus, index) => (
        <div key={index} className='flex mt-4 justify-between text-lg font-semibold'>
          <p>{urlStatus.url}</p>
          <div className={urlStatus.status === 200 ? 'w-8 h-8 bg-green-500' : 'w-8 h-8 bg-red-500'}></div>
        </div>
      ))}
      </div>

    </div>

    </div>
  );
}

export default App;