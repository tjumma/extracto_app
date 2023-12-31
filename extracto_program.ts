export type ExtractoProgram = {
  "version": "0.1.0",
  "name": "extracto_program",
  "instructions": [
    {
      "name": "initPlayer",
      "accounts": [
        {
          "name": "playerData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "run",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "startNewRun",
      "accounts": [
        {
          "name": "run",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false
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
      "name": "finishRun",
      "accounts": [
        {
          "name": "run",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "threadAuthority",
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
          "name": "run",
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
          "name": "user",
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
          "name": "user",
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
          "name": "user",
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
          "name": "user",
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
          "name": "run",
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
          "name": "run",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "sessionToken",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        }
      ],
      "args": []
    },
    {
      "name": "upgrade",
      "accounts": [
        {
          "name": "run",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "sessionToken",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        }
      ],
      "args": [
        {
          "name": "cardSlot",
          "type": "u16"
        },
        {
          "name": "characterSlotIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "reset",
      "accounts": [
        {
          "name": "run",
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
      "name": "runData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "score",
            "type": "u64"
          },
          {
            "name": "experience",
            "type": "u16"
          },
          {
            "name": "slots",
            "type": {
              "array": [
                {
                  "option": {
                    "defined": "CharacterInfo"
                  }
                },
                7
              ]
            }
          },
          {
            "name": "lastCharacterId",
            "type": "u16"
          },
          {
            "name": "cards",
            "type": {
              "array": [
                {
                  "defined": "CardInfo"
                },
                3
              ]
            }
          },
          {
            "name": "lastCardId",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "playerData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "runsFinished",
            "type": "u32"
          },
          {
            "name": "bestScore",
            "type": "u64"
          },
          {
            "name": "isInRun",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CharacterInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u16"
          },
          {
            "name": "alignment",
            "type": "u8"
          },
          {
            "name": "characterType",
            "type": "u8"
          },
          {
            "name": "cooldown",
            "type": "u8"
          },
          {
            "name": "cooldownTimer",
            "type": "u8"
          },
          {
            "name": "maxHealth",
            "type": "u8"
          },
          {
            "name": "health",
            "type": "u8"
          },
          {
            "name": "attackDamage",
            "type": "u8"
          },
          {
            "name": "state",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u16"
          },
          {
            "name": "cardType",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "WrongAuthority",
      "msg": "Wrong Authority"
    }
  ]
};

export const IDL: ExtractoProgram = {
  "version": "0.1.0",
  "name": "extracto_program",
  "instructions": [
    {
      "name": "initPlayer",
      "accounts": [
        {
          "name": "playerData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "run",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "startNewRun",
      "accounts": [
        {
          "name": "run",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "threadAuthority",
          "isMut": false,
          "isSigner": false
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
      "name": "finishRun",
      "accounts": [
        {
          "name": "run",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "clockworkProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "thread",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "threadAuthority",
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
          "name": "run",
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
          "name": "user",
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
          "name": "user",
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
          "name": "user",
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
          "name": "user",
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
          "name": "run",
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
          "name": "run",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "sessionToken",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        }
      ],
      "args": []
    },
    {
      "name": "upgrade",
      "accounts": [
        {
          "name": "run",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "sessionToken",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        }
      ],
      "args": [
        {
          "name": "cardSlot",
          "type": "u16"
        },
        {
          "name": "characterSlotIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "reset",
      "accounts": [
        {
          "name": "run",
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
      "name": "runData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "score",
            "type": "u64"
          },
          {
            "name": "experience",
            "type": "u16"
          },
          {
            "name": "slots",
            "type": {
              "array": [
                {
                  "option": {
                    "defined": "CharacterInfo"
                  }
                },
                7
              ]
            }
          },
          {
            "name": "lastCharacterId",
            "type": "u16"
          },
          {
            "name": "cards",
            "type": {
              "array": [
                {
                  "defined": "CardInfo"
                },
                3
              ]
            }
          },
          {
            "name": "lastCardId",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "playerData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "runsFinished",
            "type": "u32"
          },
          {
            "name": "bestScore",
            "type": "u64"
          },
          {
            "name": "isInRun",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CharacterInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u16"
          },
          {
            "name": "alignment",
            "type": "u8"
          },
          {
            "name": "characterType",
            "type": "u8"
          },
          {
            "name": "cooldown",
            "type": "u8"
          },
          {
            "name": "cooldownTimer",
            "type": "u8"
          },
          {
            "name": "maxHealth",
            "type": "u8"
          },
          {
            "name": "health",
            "type": "u8"
          },
          {
            "name": "attackDamage",
            "type": "u8"
          },
          {
            "name": "state",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CardInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u16"
          },
          {
            "name": "cardType",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "WrongAuthority",
      "msg": "Wrong Authority"
    }
  ]
};
