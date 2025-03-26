import { NextPage } from 'next';

const About: NextPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-medium text-gray-900 mb-4">About Savage Garden</h1>
        
        <div className="prose max-w-none">
          <p>
            Savage Garden is a plant monitoring system that connects with ESP32 devices to track
            plant health and environmental conditions. The system helps plant enthusiasts maintain
            optimal growing conditions while also tracking the positive environmental impact of
            their plants through carbon savings calculations.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to promote sustainable planting and help users understand the
            environmental benefits of maintaining indoor and outdoor plants. By tracking carbon
            dioxide absorption and providing equivalent metrics, we aim to encourage more people
            to grow plants and contribute to a healthier planet.
          </p>
          
          <h2>How It Works</h2>
          <p>
            Savage Garden uses ESP32 microcontrollers with attached sensors to monitor:
          </p>
          <ul>
            <li><strong>Soil Moisture:</strong> Ensures plants receive the right amount of water</li>
            <li><strong>Temperature:</strong> Monitors environmental conditions for optimal growth</li>
            <li><strong>Light Intensity:</strong> Tracks if plants are receiving enough light</li>
            <li><strong>Plant Weight:</strong> Helps determine growth rates and water needs</li>
          </ul>
          
          <p>
            The system calculates carbon savings based on plant species, size, and growth rate.
            These calculations help users understand their positive environmental impact in terms of:
          </p>
          <ul>
            <li>Total CO₂ absorbed</li>
            <li>Equivalent car miles not driven</li>
            <li>Equivalent number of trees</li>
          </ul>
          
          <h2>ESP32 Integration</h2>
          <p>
            The ESP32 devices used in Savage Garden connect to the system via WiFi and periodically
            send sensor readings to our API. The data is then processed and displayed in the
            dashboard and individual plant pages.
          </p>
          <p>
            To connect your own ESP32 device:
          </p>
          <ol>
            <li>Flash your ESP32 with our firmware (available on GitHub)</li>
            <li>Configure the device with your WiFi credentials and plant ID</li>
            <li>Place the sensors according to the provided instructions</li>
            <li>The device will automatically connect and start sending data</li>
          </ol>
          
          <h2>Future Development</h2>
          <p>
            We are continuously improving Savage Garden with plans to add:
          </p>
          <ul>
            <li>Automated watering systems</li>
            <li>Plant species recognition using machine learning</li>
            <li>Community features to share plant care tips</li>
            <li>Mobile app for on-the-go monitoring</li>
          </ul>
          
          <h2>Contact Us</h2>
          <p>
            For questions, suggestions, or technical support, please reach out to us at:
            <br />
            <a href="mailto:info@savage-garden.example.com" className="text-primary hover:underline">
              info@savage-garden.example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About; 