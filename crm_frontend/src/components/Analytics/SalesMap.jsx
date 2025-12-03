/**
 * Sales Map Component
 * Geographical visualization of sales data using Leaflet
 */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SalesMap = () => {
    const [dealsByLocation, setDealsByLocation] = useState([
        { id: 1, country: 'United States', city: 'New York', lat: 40.7128, lng: -74.0060, revenue: 145000, deals: 12 },
        { id: 2, country: 'United States', city: 'San Francisco', lat: 37.7749, lng: -122.4194, revenue: 98000, deals: 8 },
        { id: 3, country: 'United Kingdom', city: 'London', lat: 51.5074, lng: -0.1278, revenue: 87000, deals: 7 },
        { id: 4, country: 'Germany', city: 'Berlin', lat: 52.5200, lng: 13.4050, revenue: 65000, deals: 5 },
        { id: 5, country: 'France', city: 'Paris', lat: 48.8566, lng: 2.3522, revenue: 72000, deals: 6 },
        { id: 6, country: 'Japan', city: 'Tokyo', lat: 35.6762, lng: 139.6503, revenue: 110000, deals: 9 },
        { id: 7, country: 'Australia', city: 'Sydney', lat: -33.8688, lng: 151.2093, revenue: 54000, deals: 4 },
        { id: 8, country: 'Canada', city: 'Toronto', lat: 43.6532, lng: -79.3832, revenue: 78000, deals: 6 },
        { id: 9, country: 'India', city: 'Mumbai', lat: 19.0760, lng: 72.8777, revenue: 45000, deals: 5 },
        { id: 10, country: 'Singapore', city: 'Singapore', lat: 1.3521, lng: 103.8198, revenue: 92000, deals: 7 },
    ]);

    const getMarkerSize = (revenue) => {
        // Scale marker size based on revenue
        return Math.max(10, Math.min(40, revenue / 3000));
    };

    const getMarkerColor = (revenue) => {
        if (revenue > 100000) return '#48bb78'; // Green - High
        if (revenue > 70000) return '#38b2ac'; // Teal - Medium
        if (revenue > 50000) return '#4299e1'; // Blue - Low
        return '#a0aec0'; // Gray - Very low
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const totalRevenue = dealsByLocation.reduce((sum, loc) => sum + loc.revenue, 0);
    const totalDeals = dealsByLocation.reduce((sum, loc) => sum + loc.deals, 0);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Global Sales Map 🗺️</h1>
                <button className="btn btn-primary">
                    📥 Export Map Data
                </button>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="stat-card">
                    <div className="stat-label">Total Locations</div>
                    <div className="stat-value">{dealsByLocation.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Global Revenue</div>
                    <div className="stat-value">{formatCurrency(totalRevenue)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Deals</div>
                    <div className="stat-value">{totalDeals}</div>
                </div>
            </div>

            {/* Map */}
            <div className="card">
                <div className="card-header">Sales Distribution by Location</div>
                <div className="card-body" style={{ height: '500px', padding: 0 }}>
                    <MapContainer
                        center={[20, 0]}
                        zoom={2}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {dealsByLocation.map((location) => (
                            <CircleMarker
                                key={location.id}
                                center={[location.lat, location.lng]}
                                radius={getMarkerSize(location.revenue)}
                                fillColor={getMarkerColor(location.revenue)}
                                color="white"
                                weight={2}
                                opacity={1}
                                fillOpacity={0.7}
                            >
                                <Popup>
                                    <div style={{ padding: '5px' }}>
                                        <h4 style={{ margin: '0 0 10px 0' }}>{location.city}, {location.country}</h4>
                                        <p style={{ margin: '5px 0' }}><strong>Revenue:</strong> {formatCurrency(location.revenue)}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Deals:</strong> {location.deals}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Avg Deal Size:</strong> {formatCurrency(location.revenue / location.deals)}</p>
                                    </div>
                                </Popup>
                                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                    <strong>{location.city}</strong><br />
                                    {formatCurrency(location.revenue)}
                                </Tooltip>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            {/* Legend */}
            <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-header">Map Legend</div>
                <div className="card-body">
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#48bb78' }}></div>
                            <span>High Revenue (&gt; $100k)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#38b2ac' }}></div>
                            <span>Medium Revenue ($70k - $100k)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#4299e1' }}></div>
                            <span>Low Revenue ($50k - $70k)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#a0aec0' }}></div>
                            <span>Very Low Revenue (&lt; $50k)</span>
                        </div>
                    </div>
                    <p style={{ marginTop: '15px', color: 'var(--gray-600)', fontSize: '13px' }}>
                        Note: Marker size represents revenue amount. Click on markers for detailed information.
                    </p>
                </div>
            </div>

            {/* Top Locations Table */}
            <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-header">Top Performing Locations</div>
                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>City, Country</th>
                                <th>Revenue</th>
                                <th>Deals</th>
                                <th>Avg Deal Size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dealsByLocation
                                .sort((a, b) => b.revenue - a.revenue)
                                .slice(0, 5)
                                .map((location, index) => (
                                    <tr key={location.id}>
                                        <td><strong>#{index + 1}</strong></td>
                                        <td>{location.city}, {location.country}</td>
                                        <td><strong>{formatCurrency(location.revenue)}</strong></td>
                                        <td>{location.deals}</td>
                                        <td>{formatCurrency(location.revenue / location.deals)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesMap;
