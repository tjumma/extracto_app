export type ExtractoProgram = {
  "version": "0.1.0",
  "name": "extracto_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "startThread",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Clockwork thread program."
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The signer who will pay to initialize the program.",
            "(not to be confused with the thread executions)."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Solana system program."
          ]
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Address to assign to the newly created thread."
          ]
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The pda that will own and manage the thread."
          ]
        }
      ],
      "args": [
        {
          "name": "threadId",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "pauseThread",
      "accounts": [
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Clockwork thread program."
          ]
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The thread to pause."
          ]
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The pda that will own and manage the thread."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "resumeThread",
      "accounts": [
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Clockwork thread program."
          ]
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The thread to reset."
          ]
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The pda that will own and manage the thread."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "deleteThread",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Clockwork thread program."
          ]
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The thread to reset."
          ]
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The pda that owns and manages the thread."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "incrementViaThread",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "thread",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Verify that only this thread can execute the Increment Instruction"
          ]
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Thread Admin",
            "The authority that was used as a seed to derive the thread address",
            "`thread_authority` should equal `thread.thread_authority`"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "increment",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "reset",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "counter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    }
  ]
};

export const IDL: ExtractoProgram = {
  "version": "0.1.0",
  "name": "extracto_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "startThread",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Clockwork thread program."
          ]
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "The signer who will pay to initialize the program.",
            "(not to be confused with the thread executions)."
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Solana system program."
          ]
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "Address to assign to the newly created thread."
          ]
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The pda that will own and manage the thread."
          ]
        }
      ],
      "args": [
        {
          "name": "threadId",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "pauseThread",
      "accounts": [
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Clockwork thread program."
          ]
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The thread to pause."
          ]
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The pda that will own and manage the thread."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "resumeThread",
      "accounts": [
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Clockwork thread program."
          ]
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The thread to reset."
          ]
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The pda that will own and manage the thread."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "deleteThread",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Clockwork thread program."
          ]
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The thread to reset."
          ]
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The pda that owns and manages the thread."
          ]
        }
      ],
      "args": []
    },
    {
      "name": "incrementViaThread",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "thread",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "Verify that only this thread can execute the Increment Instruction"
          ]
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The Thread Admin",
            "The authority that was used as a seed to derive the thread address",
            "`thread_authority` should equal `thread.thread_authority`"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "increment",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "reset",
      "accounts": [
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "counter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
