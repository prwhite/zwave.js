

exports.Defs = {

    MAX_TRIES:		3,	// Retry sends up to 3 times
    MAX_MAX_TRIES:		7,	// Don't exceed this retry limit
    RETRY_TIMEOUT:	2000,		// Retry send after two seconds
    
    SOF:												0x01,
    ACK:												0x06,
    NAK:												0x15,
    CAN:												0x18,
    
    NUM_NODE_BITFIELD_BYTES:							29,		// 29, bytes = 23,2 bits, one for each possible node in the network.
    
    REQUEST:											0x00,
    RESPONSE:										0x01,
    
    ZW_CLOCK_SET:									0x30,
    
    TRANSMIT_OPTION_ACK:		 						0x01,
    TRANSMIT_OPTION_LOW_POWER:		   				0x02,
    TRANSMIT_OPTION_AUTO_ROUTE:  					0x04,
    TRANSMIT_OPTION_NO_ROUTE: 						0x10,
    
    TRANSMIT_COMPLETE_OK:	  						0x00,
    TRANSMIT_COMPLETE_NO_ACK:	  					0x01,
    TRANSMIT_COMPLETE_FAIL:							0x02,
    TRANSMIT_COMPLETE_NOT_IDLE:						0x03,
    TRANSMIT_COMPLETE_NOROUTE: 						0x04,
    
    RECEIVE_STATUS_TYPE_BROAD:	 					0x04,
    
    FUNC_ID_SERIAL_API_GET_INIT_DATA:				0x02,
    FUNC_ID_APPLICATION_COMMAND_HANDLER:				0x04,
    FUNC_ID_ZW_GET_CONTROLLER_CAPABILITIES:				0x05,
    FUNC_ID_SERIAL_API_SET_TIMEOUTS: 				0x06,
    FUNC_ID_SERIAL_API_GET_CAPABILITIES:				0x07,
    FUNC_ID_SERIAL_API_SOFT_RESET:					0x08,
    
    FUNC_ID_ZW_SEND_DATA:						0x13,
    FUNC_ID_ZW_GET_VERSION:						0x15,
    FUNC_ID_ZW_R_F_POWER_LEVEL_SET:					0x17,
    FUNC_ID_ZW_MEMORY_GET_ID:					0x20,
    FUNC_ID_MEMORY_GET_BYTE:						0x21,
    FUNC_ID_ZW_READ_MEMORY:						0x23,
    
    FUNC_ID_ZW_SET_LEARN_NODE_STATE:					0x40,	// Not implemented
    FUNC_ID_ZW_GET_NODE_PROTOCOL_INFO:				0x41,	// Get protocol info (baud rate, listening, etc.) for a given node
    FUNC_ID_ZW_SET_DEFAULT:						0x42,	// Reset controller and node info to default (original) values
    FUNC_ID_ZW_NEW_CONTROLLER:					0x43,	// Not implemented
    FUNC_ID_ZW_REPLICATION_COMMAND_COMPLETE:				0x44,	// Replication isn't implemented (yet)
    FUNC_ID_ZW_REPLICATION_SEND_DATA:				0x45,	// Replication isn't implemented (yet)
    FUNC_ID_ZW_ASSIGN_RETURN_ROUTE:					0x46,	// Assign a return route from the specified node to the controller
    FUNC_ID_ZW_DELETE_RETURN_ROUTE:					0x47,	// Delete all return routes from the specified node
    FUNC_ID_ZW_REQUEST_NODE_NEIGHBOR_UPDATE:				0x48,	// Ask the specified node to update its neighbors (then read them from the controller)
    FUNC_ID_ZW_APPLICATION_UPDATE:					0x49,	// Get a list of supported (and controller) command classes
    FUNC_ID_ZW_ADD_NODE_TO_NETWORK:					0x4a,	// Control the addnode (or addcontroller) process...start, stop, etc.
    FUNC_ID_ZW_REMOVE_NODE_FROM_NETWORK:				0x4b,	// Control the removenode (or removecontroller) process...start, stop, etc.
    FUNC_ID_ZW_CREATE_NEW_PRIMARY:					0x4c,	// Control the createnewprimary process...start, stop, etc.
    FUNC_ID_ZW_CONTROLLER_CHANGE:					0x4d,	// Control the transferprimary process...start, stop, etc.
    FUNC_ID_ZW_SET_LEARN_MODE:					0x50,	// Put a controller into learn mode for replication/ receipt of configuration info
    FUNC_ID_ZW_ENABLE_SUC:						0x52,	// Make a controller a Static Update Controller
    FUNC_ID_ZW_REQUEST_NETWORK_UPDATE:				0x53,	// Network update for a SUC(?)
    FUNC_ID_ZW_SET_SUC_NODE_ID:					0x54,	// Identify a Static Update Controller node id
    FUNC_ID_ZW_GET_SUC_NODE_ID:					0x56,	// Try to retrieve a Static Update Controller node id (zero if no SUC present)
    FUNC_ID_ZW_REQUEST_NODE_INFO:					0x60,	// Get info (supported command classes) for the specified node
    FUNC_ID_ZW_REMOVE_FAILED_NODE_ID:				0x61,	// Mark a specified node id as failed
    FUNC_ID_ZW_IS_FAILED_NODE_ID:					0x62,	// Check to see if a specified node has failed
    FUNC_ID_ZW_REPLACE_FAILED_NODE:					0x63,	// Remove a failed node from the controller's list (?)
    FUNC_ID_ZW_GET_ROUTING_INFO:					0x80,	// Get a specified node's neighbor information from the controller
    FUNC_ID_SERIAL_API_SLAVE_NODE_INFO:				0xA0,	// Set application virtual slave node information
    FUNC_ID_APPLICATION_SLAVE_COMMAND_HANDLER:			0xA1,	// Slave command handler
    FUNC_ID_ZW_SEND_SLAVE_NODE_INFO:					0xA2,	// Send a slave node information frame
    FUNC_ID_ZW_SEND_SLAVE_DATA:					0xA3,	// Send data from slave
    FUNC_ID_ZW_SET_SLAVE_LEARN_MODE:					0xA4,	// Enter slave learn mode
    FUNC_ID_ZW_GET_VIRTUAL_NODES:					0xA5,	// Return all virtual nodes
    FUNC_ID_ZW_IS_VIRTUAL_NODE:					0xA6,	// Virtual node test
    FUNC_ID_ZW_SET_PROMISCUOUS_MODE:					0xD0,	// Set controller into promiscuous mode to listen to all frames
    FUNC_ID_PROMISCUOUS_APPLICATION_COMMAND_HANDLER:			0xD1,
    
    ADD_NODE_ANY:									0x01,
    ADD_NODE_CONTROLLER:								0x02,
    ADD_NODE_SLAVE:									0x03,
    ADD_NODE_EXISTING:								0x04,
    ADD_NODE_STOP:									0x05,
    ADD_NODE_STOP_FAILED:							0x06,
    
    ADD_NODE_STATUS_LEARN_READY:						0x01,
    ADD_NODE_STATUS_NODE_FOUND:						0x02,
    ADD_NODE_STATUS_ADDING_SLAVE:	 				0x03,
    ADD_NODE_STATUS_ADDING_CONTROLLER:				0x04,
    ADD_NODE_STATUS_PROTOCOL_DONE:					0x05,
    ADD_NODE_STATUS_DONE:							0x06,
    ADD_NODE_STATUS_FAILED:							0x07,
    
    REMOVE_NODE_ANY:									0x01,
    REMOVE_NODE_STOP:								0x05,
                                                        
    REMOVE_NODE_STATUS_LEARN_READY:					0x01,
    REMOVE_NODE_STATUS_NODE_FOUND:					0x02,
    REMOVE_NODE_STATUS_REMOVING_SLAVE:				0x03,
    REMOVE_NODE_STATUS_REMOVING_CONTROLLER:			0x04,
    REMOVE_NODE_STATUS_DONE:							0x06,
    REMOVE_NODE_STATUS_FAILED:						0x07,
    
    CREATE_PRIMARY_START:							0x02,
    CREATE_PRIMARY_STOP:								0x05,
    CREATE_PRIMARY_STOP_FAILED:						0x06,
    
    CONTROLLER_CHANGE_START:							0x02,
    CONTROLLER_CHANGE_STOP:							0x05,
    CONTROLLER_CHANGE_STOP_FAILED:					0x06,
    
    LEARN_MODE_STARTED:								0x01,
    LEARN_MODE_DONE:									0x06,	
    LEARN_MODE_FAILED:								0x07,
    LEARN_MODE_DELETED:								0x80,
    
    REQUEST_NEIGHBOR_UPDATE_STARTED:					0x21,
    REQUEST_NEIGHBOR_UPDATE_DONE:					0x22,
    REQUEST_NEIGHBOR_UPDATE_FAILED:					0x23,
    
    FAILED_NODE_OK:									0x00,
    FAILED_NODE_REMOVED:								0x01,
    FAILED_NODE_NOT_REMOVED:							0x02,
    
    FAILED_NODE_REPLACE_WAITING:						0x03,
    FAILED_NODE_REPLACE_DONE:						0x04,
    FAILED_NODE_REPLACE_FAILED:						0x05,
    
    FAILED_NODE_REMOVE_STARTED:						0x00,
    FAILED_NODE_NOT_PRIMARY_CONTROLLER:				0x02,
    FAILED_NODE_NO_CALLBACK_FUNCTION:				0x04,
    FAILED_NODE_NOT_FOUND:							0x08,
    FAILED_NODE_REMOVE_PROCESS_BUSY:					0x10,
    FAILED_NODE_REMOVE_FAIL:							0x20,
    
    SUC_UPDATE_DONE:									0x00,
    SUC_UPDATE_ABORT:								0x01,
    SUC_UPDATE_WAIT:									0x02,
    SUC_UPDATE_DISABLED:								0x03,
    SUC_UPDATE_OVERFLOW:								0x04,
    
    SUC_FUNC_BASIC_SUC:								0x00,
    SUC_FUNC_NODEID_SERVER:							0x01,
    
    UPDATE_STATE_NODE_INFO_RECEIVED:					0x84,
    UPDATE_STATE_NODE_INFO_REQ_DONE:					0x82,
    UPDATE_STATE_NODE_INFO_REQ_FAILED:				0x81,
    UPDATE_STATE_ROUTING_PENDING:					0x80,
    UPDATE_STATE_NEW_ID_ASSIGNED:					0x40,
    UPDATE_STATE_DELETE_DONE:						0x20,
    UPDATE_STATE_SUC_ID:								0x10,
    
    SLAVE_ASSIGN_COMPLETE:							0x00,
    SLAVE_ASSIGN_NODEID_DONE:						0x01,	// Node ID has been assigned
    SLAVE_ASSIGN_RANGE_INFO_UPDATE:					0x02,	// Node is doing neighbor discovery
    
    SLAVE_LEARN_MODE_DISABLE:						0x00,	// disable add/remove virtual slave nodes
    SLAVE_LEARN_MODE_ENABLE:							0x01,	// enable ability to include/exclude virtual slave nodes
    SLAVE_LEARN_MODE_ADD:							0x02,	// add node directly but only if primary/inclusion controller
    SLAVE_LEARN_MODE_REMOVE:							0x03,	// remove node directly but only if primary/inclusion controller
    
    OPTION_HIGH_POWER:								0x80,
    
    //Device request related
    BASIC_SET:										0x01,
    BASIC_REPORT:									0x03,
    
    COMMAND_CLASS_BASIC:								0x20,
    COMMAND_CLASS_CONTROLLER_REPLICATION:			0x21,
    COMMAND_CLASS_APPLICATION_STATUS: 				0x22,
    COMMAND_CLASS_HAIL:								0x82,

};

