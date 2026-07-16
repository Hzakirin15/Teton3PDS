"""SFCS_PASS
Check current SFCS stage meets the define

python run_test.py -proj teton2 -t SFCS_PASS_WYMX
    -p '{"stage": "KR", "type": "L10.5"}' \
    -n '{"serial_num": "WAA7HN5030MWM", "container_serial_num": "4002303662", "operator_id": "MW24110161",
    "jbog_0_sn": "WAA7JB5033C4M", "jbog_1_sn": "WAA7JB5021BPM", "jbog_2_sn": "WAA7JB5021BNM", "jbog_3_sn": "WAA7JB5021BMM",
    "jbog_4_sn": "WAA7JB5021BSM", "jbog_5_sn": "WAA7JB5021F0M", "jbog_6_sn": "WAA7JB5021BRM", "jbog_7_sn": "WAA7JB5033BHM"}'
"""



"""SFCS_PASS
Check current SFCS stage meets the define

python run_test.py -proj teton2 -t SFCS_PASS_WYMX
    -p '{"stage": "KR", "type": "L10.5"}' \
    -n '{"serial_num": "WAA7HN5030MWM", "container_serial_num": "4002303662", "operator_id": "MW24110161",
    "jbog_0_sn": "WAA7JB5033C4M", "jbog_1_sn": "WAA7JB5021BPM", "jbog_2_sn": "WAA7JB5021BNM", "jbog_3_sn": "WAA7JB5021BMM",
    "jbog_4_sn": "WAA7JB5021BSM", "jbog_5_sn": "WAA7JB5021F0M", "jbog_6_sn": "WAA7JB5021BRM", "jbog_7_sn": "WAA7JB5033BHM"}'
"""






from typing import Any
import lib
import time
from mfg_test.aws_lib.shopfloor import AmberSFCS as SFCS

# Stage sequence order
L10_STAGE_SEQUENCE = ['WT', 'PT', 'BS', 'TN', 'TO', 'TP', 'IO', 'W3', 'SJ', 'KR', 'MR', 'SL', 'PO', 'SN', 'ZZ']


def _is_stage_at_or_after(current_stage: str, expected_stage: str) -> bool:
    """Check if current stage is at or after the expected stage in sequence.

    Args:
        current_stage: Current stage from SFCS
        expected_stage: Expected minimum stage

    Returns:
        True if current stage is at or after expected stage
    """
    try:
        current_idx = L10_STAGE_SEQUENCE.index(current_stage)
        expected_idx = L10_STAGE_SEQUENCE.index(expected_stage)
        return current_idx >= expected_idx
    except ValueError:
        return current_stage == expected_stage


def _check_and_pass_stage(sfcs: SFCS, serial_num: str, current_stage: str, operator_id: str,
                         location: str, description: str, logger: Any,
                         allow_higher: bool = False) -> bool:
    """Check SFCS stage and pass if valid.

    Args:
        sfcs: SFCS instance
        serial_num: Serial number to check
        current_stage: Expected stage to pass
        operator_id: Operator ID
        location: Rack location
        description: Description for logging
        logger: Logger instance
        allow_higher: Allow stages higher than expected

    Returns:
        True if check and pass succeeds, False otherwise
    """
    try:
        logger.info(f'Check SFCS stage {description} SN={serial_num}')
        stage_dut = sfcs.get_stage(serial_num, 'AO')

        if stage_dut == current_stage:
            logger.info(f'{description} SN: {serial_num}, Stage: {stage_dut}, Rack Location: {location}, Operator ID: {operator_id} go to jump stage')
            result = sfcs.complete(serial_num, current_stage, operator_id, location)
            logger.info(f'[PASS] {description} SN: {serial_num} jump stage already, Pass')
            return True

        elif allow_higher and _is_stage_at_or_after(stage_dut, current_stage):
            logger.info(f'Check {description} SN {serial_num} is at stage "{stage_dut}" which is at or after "{current_stage}" - Passed')
            return True

        else:
            logger.error(f"Set {description} SN {serial_num} SFCS PASS failed, stage_actual: {stage_dut}, expected: {current_stage}")
            return False

    except Exception as e:
        logger.error(f"Failed to check and pass SFCS stage for {description} SN {serial_num}: {str(e)}")
        return False


def Setup(args: Any) -> None:
    """Setup function for SFCS_PASS test.

    Args:
        args: Test arguments containing params and node info
    """
    pass


def Execute(args: Any) -> None:
    """Execute SFCS_PASS test to validate and advance SFCS stages.

    Args:
        args: Test arguments containing params and node info

    Raises:
        ValueError: If input validation fails
        AssertionError: If SFCS stage validation or completion fails
    """
    LOG = lib.ctx.logger
    params = args.params
    node = args.node

    # Input validation
    if not params or 'stage' not in params:
        raise ValueError("Missing required parameter 'stage'")

    current_stage = params["stage"]
    sn_type = params.get('type', 'L10')

    if sn_type in ['L10', 'L10.5'] and 'serial_num' not in node:
        raise ValueError(f"Missing required 'serial_num' for type {sn_type}")
    if sn_type == 'L11' and 'container_serial_num' not in node:
        raise ValueError("Missing required 'container_serial_num' for type L11")

    sfcs = SFCS()
    is_pass = True
    node_sn = node['serial_num']
    rack_location = node.get('container_location', '')
    op_id = node.get('operator_id', '')

    if sn_type in ['L10', 'L10.5']:
        stage_dut = sfcs.get_stage(node_sn, 'AO')
        time.sleep(5)
        LOG.info(f'Check SFCS stage SN={node_sn}')

    if sn_type == 'L10':
        allow_higher = current_stage in ['WT', 'PT', 'BS', 'TN', 'TO', 'TP']
        is_pass &= _check_and_pass_stage(sfcs, node_sn, current_stage, op_id, rack_location,
                                        'Headnode', LOG, allow_higher)

    elif sn_type == 'L10.5':
        allow_higher = current_stage in ['SJ', 'KR', 'MR', 'SL']
        is_pass &= _check_and_pass_stage(sfcs, node_sn, current_stage, op_id, rack_location,
                                        'L10.5 Headnode', LOG, allow_higher)

        for slot_id in range(0, 8):
            jbog_sn = node.get(f'jbog_{slot_id}_sn')
            if jbog_sn:
                is_pass &= _check_and_pass_stage(sfcs, jbog_sn, current_stage, op_id, rack_location,
                                                f'JBOG_{slot_id}', LOG, allow_higher)

        assert is_pass, "L10.5 SFCS_PASS Check Fail"

    elif sn_type == 'L11':
        rack_id = node['container_serial_num']
        LOG.info(f'Check SFCS stage Rack SN={rack_id}')
        try:
            result = sfcs.complete(rack_id, current_stage, op_id, rack_id)
            assert "OK" == result, f"Set SFCS PASS failed. Result: {result}"
            LOG.info(f"[PASS info]\nRack ID: {rack_id}, Stage: {current_stage}, Operator ID: {op_id}")
        except Exception as e:
            LOG.error(f"Failed to complete SFCS stage for L11 Rack SN {rack_id}: {str(e)}")
            raise

    else:
        raise ValueError(f"Unsupported serial number type: {sn_type}")


def Cleanup(args: Any) -> None:
    """Cleanup function for SFCS_PASS test.

    Args:
        args: Test arguments
    """
    pass
