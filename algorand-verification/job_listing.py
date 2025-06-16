from pyteal import *

def approval_program():
    # Global state keys
    job_title = Bytes("title")
    job_desc = Bytes("desc")
    company = Bytes("company")
    expiration = Bytes("exp")  # UNIX timestamp

    on_create = Seq([
        App.globalPut(job_title, Txn.application_args[0]),
        App.globalPut(job_desc, Txn.application_args[1]),
        App.globalPut(company, Txn.application_args[2]),
        App.globalPut(expiration, Btoi(Txn.application_args[3])),
        Approve()
    ])

    # Only allow delete after expiration
    can_delete = And(
        Txn.type_enum() == TxnType.ApplicationCall,
        Global.latest_timestamp() > App.globalGet(expiration)
    )

    on_delete = Return(can_delete)

    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.DeleteApplication, on_delete]
    )

    return program

def clear_state_program():
    return Approve()

if __name__ == "__main__":
    with open("job_listing_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=6)
        f.write(compiled)
    with open("job_listing_clear.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=6)
        f.write(compiled)
